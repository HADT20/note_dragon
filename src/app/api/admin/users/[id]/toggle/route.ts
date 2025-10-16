import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

    const [users] = await pool.query<RowDataPacket[]>(
      'SELECT role FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0 || users[0].role !== 'admin') {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = parseInt(params.id);
    const { is_active } = await request.json();

    // Cập nhật trạng thái
    await pool.query(
      'UPDATE users SET is_active = ? WHERE id = ?',
      [is_active, userId]
    );

    return NextResponse.json({ 
      message: is_active ? 'Đã kích hoạt người dùng' : 'Đã vô hiệu hóa người dùng' 
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

