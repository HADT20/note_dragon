import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    // Lấy token từ header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Verify token
    let decoded: { userId: number };
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    } catch {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Kiểm tra user có phải admin không
    const [users] = await pool.query<RowDataPacket[]>(
      'SELECT role FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0 || users[0].role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // Lấy thống kê
    const [userCount] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM users'
    );

    const [linkCount] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM short_links'
    );

    const [noteCount] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM notes'
    );

    const [qrCount] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM qr_codes'
    );

    return NextResponse.json({
      totalUsers: userCount[0].count,
      totalLinks: linkCount[0].count,
      totalNotes: noteCount[0].count,
      totalQRCodes: qrCount[0].count
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

