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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = parseInt(params.id);

    // Không cho phép xóa admin
    const [user] = await pool.query<RowDataPacket[]>(
      'SELECT role FROM users WHERE id = ?',
      [userId]
    );

    if (user.length > 0 && user[0].role === 'admin') {
      return NextResponse.json(
        { error: 'Không thể xóa tài khoản admin' },
        { status: 403 }
      );
    }

    // Xóa user
    await pool.query('DELETE FROM users WHERE id = ?', [userId]);

    return NextResponse.json({ message: 'Đã xóa người dùng' });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

