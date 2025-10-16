import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, fullName } = await request.json();

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ thông tin' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const [existingUsers] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'Tên đăng nhập hoặc email đã tồn tại' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password, full_name) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, fullName || null]
    );

    return NextResponse.json(
      { 
        message: 'Đăng ký thành công!',
        userId: (result as any).insertId
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi đăng ký' },
      { status: 500 }
    );
  }
}

