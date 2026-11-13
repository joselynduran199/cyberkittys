from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, EmailStr
import mysql.connector

app = FastAPI(title="Cyberkitty's API")

# Configurar CORS (en producción, cambia "*" por tu dominio real)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo Pydantic mejorado con validaciones estrictas y límites de caracteres
class NuevaMiembro(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=100, description="Nombre de la solicitante")
    correo: EmailStr = Field(..., description="Correo electrónico válido")
    motivo: str = Field(..., min_length=10, max_length=500, description="Motivo para unirse")

# Configuración de conexión a la BD
def conectar_bd():
    try:
        conexion = mysql.connector.connect(
            host="localhost",
            user="usuario_cyberkittys",
            password="Chic4s#Seguras",
            database="cyberkittys_db",
            autocommit=False # Control manual de transacciones
        )
        return conexion
    except mysql.connector.Error as err:
        print(f"Error conectando a la BD: {err}")
        return None

# Método de la API para recibir registros (POST)
@app.post("/registro", status_code=status.HTTP_201_CREATED)
async def registrar_chica(chica: NuevaMiembro):
    conexion = conectar_bd()
    if not conexion:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Error interno al conectar con la base de datos"
        )
    
    cursor = conexion.cursor()
    # Consulta parametrizada segura contra SQL Injection
    query = "INSERT INTO solicitudes (nombre, correo, motivo) VALUES (%s, %s, %s)"
    valores = (chica.nombre, str(chica.correo), chica.motivo)
    
    try:
        cursor.execute(query, valores)
        conexion.commit()
        return {"mensaje": "¡Solicitud guardada exitosamente!"}
    except mysql.connector.Error as err:
        conexion.rollback()
        print(f"Error en la ejecución SQL: {err}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="No se pudo procesar el registro. Es posible que el correo ya esté registrado."
        )
    finally:
        cursor.close()
        conexion.close()