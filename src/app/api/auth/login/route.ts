import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Vui lòng nhập tên đăng nhập và mật khẩu' },
        { status: 400 }
      );
    }

    // Find user
    const [users] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, username]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Tên đăng nhập hoặc mật khẩu không đúng' },
        { status: 401 }
      );
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Tên đăng nhập hoặc mật khẩu không đúng' },
        { status: 401 }
      );
    }

    // Kiểm tra tài khoản có bị vô hiệu hóa không
    if (user.is_active === false || user.is_active === 0) {
      return NextResponse.json(
        { error: 'Tài khoản của bạn đã bị vô hiệu hóa' },
        { status: 403 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user info and token
    return NextResponse.json(
      {
        message: 'Đăng nhập thành công!',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.full_name,
          role: user.role
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi đăng nhập' },
      { status: 500 }
    );
  }
}

