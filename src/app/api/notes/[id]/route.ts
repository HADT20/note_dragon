import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Hàm verify token
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    return decoded;
  } catch {
    return null;
  }
}

// GET - Lấy note theo ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Vui lòng đăng nhập' },
        { status: 401 }
      );
    }

    const [notes] = await pool.query<RowDataPacket[]>(
      `SELECT id, title, recipient, content, note_key, created_at, updated_at 
       FROM notes 
       WHERE id = ? AND user_id = ?`,
      [params.id, user.userId]
    );

    if (notes.length === 0) {
      return NextResponse.json(
        { error: 'Không tìm thấy ghi chú' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { note: notes[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get note error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi lấy ghi chú' },
      { status: 500 }
    );
  }
}

// PUT - Cập nhật note
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Vui lòng đăng nhập' },
        { status: 401 }
      );
    }

    const { title, recipient, content } = await request.json();

    // Validate
    if (!content || content.trim() === '') {
      return NextResponse.json(
        { error: 'Vui lòng nhập nội dung ghi chú' },
        { status: 400 }
      );
    }

    // Kiểm tra note có tồn tại và thuộc về user không
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM notes WHERE id = ? AND user_id = ?',
      [params.id, user.userId]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Không tìm thấy ghi chú hoặc bạn không có quyền chỉnh sửa' },
        { status: 404 }
      );
    }

    // Cập nhật note
    await pool.query(
      `UPDATE notes 
       SET title = ?, recipient = ?, content = ?, updated_at = NOW() 
       WHERE id = ? AND user_id = ?`,
      [title || null, recipient || null, content, params.id, user.userId]
    );

    // Lấy note đã cập nhật
    const [updatedNote] = await pool.query<RowDataPacket[]>(
      'SELECT id, title, recipient, content, note_key, created_at, updated_at FROM notes WHERE id = ?',
      [params.id]
    );

    return NextResponse.json(
      {
        message: 'Ghi chú đã được cập nhật!',
        note: updatedNote[0]
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update note error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi cập nhật ghi chú' },
      { status: 500 }
    );
  }
}

// DELETE - Xóa note
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Vui lòng đăng nhập' },
        { status: 401 }
      );
    }

    // Kiểm tra note có tồn tại và thuộc về user không
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM notes WHERE id = ? AND user_id = ?',
      [params.id, user.userId]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Không tìm thấy ghi chú hoặc bạn không có quyền xóa' },
        { status: 404 }
      );
    }

    // Xóa note
    await pool.query(
      'DELETE FROM notes WHERE id = ? AND user_id = ?',
      [params.id, user.userId]
    );

    return NextResponse.json(
      { message: 'Ghi chú đã được xóa!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete note error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi xóa ghi chú' },
      { status: 500 }
    );
  }
}

