@echo off
echo.
echo   ========================================
echo     CORRE BRECHO - Iniciando...
echo   ========================================
echo.

:: Verificar se MariaDB ja esta rodando
netstat -ano | findstr ":3306.*LISTENING" >nul 2>&1
if %ERRORLEVEL%==0 (
    echo   [OK] MariaDB ja esta rodando
    goto :startnode
)

echo   [*] Iniciando MariaDB...
start "" /B "C:\Program Files\MariaDB 12.3\bin\mariadbd.exe" --console
timeout /t 3 /nobreak >nul

netstat -ano | findstr ":3306.*LISTENING" >nul 2>&1
if %ERRORLEVEL%==0 (
    echo   [OK] MariaDB iniciado
) else (
    echo   [ERRO] Falha ao iniciar MariaDB
    echo   Tente iniciar manualmente: "C:\Program Files\MariaDB 12.3\bin\mariadbd.exe" --console
    pause
    exit /b 1
)

:startnode
echo.
echo   [*] Iniciando servidor Node.js...
echo.
node server.js
