import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
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
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded;
  } catch (error) {
    return null;
  }
}

// Hàm tạo note key ngẫu nhiên
function generateNoteKey(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

// GET - Lấy danh sách notes của user
export async function GET(request: NextRequest) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Vui lòng đăng nhập' },
        { status: 401 }
      );
    }

    // Lấy tất cả notes của user
    const [notes] = await pool.query<RowDataPacket[]>(
      `SELECT id, title, recipient, content, note_key, created_at, updated_at 
       FROM notes 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [user.userId]
    );

    return NextResponse.json(
      { notes },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get notes error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi lấy danh sách ghi chú' },
      { status: 500 }
    );
  }
}

// POST - Tạo note mới
export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Vui lòng đăng nhập' },
        { status: 401 }
      );
    }

    const { title, recipient, content, note_key } = await request.json();

    // Validate
    if (!content || content.trim() === '') {
      return NextResponse.json(
        { error: 'Vui lòng nhập nội dung ghi chú' },
        { status: 400 }
      );
    }

    // Tạo note_key nếu không có
    const finalNoteKey = note_key || generateNoteKey();

    // Kiểm tra note_key đã tồn tại chưa
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM notes WHERE note_key = ?',
      [finalNoteKey]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Mã khóa đã tồn tại, vui lòng tạo mã khác' },
        { status: 400 }
      );
    }

    // Lưu note vào database
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO notes (user_id, title, recipient, content, note_key, created_at) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [user.userId, title || null, recipient || null, content, finalNoteKey]
    );

    // Lấy note vừa tạo
    const [newNote] = await pool.query<RowDataPacket[]>(
      'SELECT id, title, recipient, content, note_key, created_at FROM notes WHERE id = ?',
      [result.insertId]
    );

    return NextResponse.json(
      {
        message: 'Ghi chú đã được lưu thành công!',
        note: newNote[0]
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create note error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi lưu ghi chú' },
      { status: 500 }
    );
  }
}

