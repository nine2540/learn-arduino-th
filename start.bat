@echo off
chcp 65001 > nul
title Learn Arduino (ฉบับภาษาไทย) - ห้องเรียนเสมือนจริง 3D
echo =============================================================
echo   กำลังเริ่มต้นระบบ Learn Arduino ภาษาไทยสำหรับนักเรียนมัธยม...
echo =============================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [แจ้งเตือน] ไม่พบคำสั่ง Node.js ในเครื่อง กำลังเปิดด้วย Python...
    where python >nul 2>nul
    if %errorlevel% neq 0 (
        echo [ข้อผิดพลาด] ไม่พบทั้ง Node.js และ Python ในเครื่องของคุณ
        echo กรุณาติดตั้ง Node.js หรือ Python หรือเปิดไฟล์ app/index.html ในเบราว์เซอร์
        pause
        exit /b
    ) else (
        echo เปิดใช้งานด้วย Python HTTP Server...
        start http://localhost:3000
        cd app && python -m http.server 3000
    )
) else (
    node server.mjs
)

pause
