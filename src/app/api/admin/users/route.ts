import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware để kiểm tra admin
async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    
    const [users] = await pool.query<RowDataPacket[]>(
      'SELECT role FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0 || users[0].role !== 'admin') {
      return null;
    }

    return decoded;
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Lấy danh sách users
    const [users] = await pool.query<RowDataPacket[]>(
      'SELECT id, username, email, full_name, role, is_active, created_at, updated_at FROM users ORDER BY created_at DESC'
    );

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

