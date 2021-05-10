# Khuyay App Backend
Este es el API que se utilizará para poder consumir por parte de el Frontend de Khuyay App

## URL 🚀
A continuación se redactará las rutas de la App

### Login
Inicio de sesión de el Usuario

```
http://localhost:5000/api/login
```

### Register
Registro de el Usuario

```
http://localhost:5000/api/register
```

Con el Json

```
{
    "name" : "Jhon Doe",
    "email" : "mail@mail.com",
    "password" : "password"
}
```

### Activación
Activación del registro para el Usuario

```
http://localhost:5000/api/activation
```

Con el Json

```
{
  "token" : "token"
}
```
