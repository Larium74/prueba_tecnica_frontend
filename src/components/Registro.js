import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const defaultTheme = createTheme();

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function Registro() {
  // Estados para los campos del formulario
  const [nombres, setNombres] = React.useState('');
  const [apellidos, setApellidos] = React.useState('');
  const [fechaNacimiento, setFechaNacimiento] = React.useState('');
  const [sexo, setSexo] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [telefono, setTelefono] = React.useState('');
  const [recibirEmails, setRecibirEmails] = React.useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('https://pruebatecnicabackend-production-e08f.up.railway.app/registro', {
        Nombres_Usuario: nombres,
        Apellidos_Usuario: apellidos,
        Fecha_nacimiento_usuario: fechaNacimiento,
        Sexo_Usuario: sexo,
        Email_Usuario: email,
        Telefono_Usuario: telefono,
      });

      // Manejar la respuesta de la API
      console.log('Respuesta de la API:', response.data);
      

      // Redirigir o mostrar un mensaje en función de la respuesta de la API
      // Ejemplo: if(response.data.success) { redirigir a otra página }

    } catch (error) {
      console.error('Error al registrar:', error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="nombres"
                  label="Nombres"
                  name="nombres"
                  autoComplete="given-name"
                  value={nombres}
                  onChange={(e) => setNombres(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="apellidos"
                  label="Apellidos"
                  name="apellidos"
                  autoComplete="family-name"
                  value={apellidos}
                  onChange={(e) => setApellidos(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="fechaNacimiento"
                  label="Fecha de Nacimiento"
                  name="fechaNacimiento"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel id="sexo-label">Sexo</InputLabel>
                <Select
                  labelId="sexo-label"
                  id="sexo"
                  name="sexo"
                  fullWidth
                  value={sexo}
                  onChange={(e) => setSexo(e.target.value)}
                >
                  <MenuItem value="Mujer">Mujer</MenuItem>
                  <MenuItem value="Hombre">Hombre</MenuItem>
                  <MenuItem value="Personalizado">Personalizado</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="telefono"
                  label="Teléfono"
                  name="telefono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={recibirEmails}
                      color="primary"
                      onChange={(e) => setRecibirEmails(e.target.checked)}
                    />
                  }
                  label="Recordar contraseña"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container spacing={2} justifyContent="center" sx={{ mb: 2 }}>
              <Grid item>
                <Link href="#" variant="body2">
                  Olvidaste la contraseña?
                </Link>
              </Grid>
            </Grid>
            <Grid container justifyContent="center">
              <Grid item>
                <Link href="#" variant="body2">
                  ¿Ya tienes una cuenta? Inicia sesión
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}