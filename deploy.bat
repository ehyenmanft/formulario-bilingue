@echo off
echo ========================================================
echo  Subiendo Formulario Bilingue a GitHub (ehyenmanft)
echo ========================================================
git push -u origin main
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo  Exito! Archivos subidos a:
    echo  https://github.com/ehyenmanft/formulario-bilingue
    echo ========================================================
) else (
    echo.
    echo Error al subir. Recuerda haber creado el repositorio
    echo 'formulario-bilingue' en https://github.com/new
)
pause
