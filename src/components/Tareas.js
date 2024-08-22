import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../components/UserProvider';
import {
  Card, CardHeader, CardContent, CardActions, IconButton, Typography, Collapse, Avatar, styled, Menu, MenuItem,
  Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, FormControl, InputLabel, Select, MenuItem as SelectMenuItem
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { red } from '@mui/material/colors';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const formatDateForInput = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const Tareas = () => {
  const { userEmail } = useContext(UserContext);
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTareas, setExpandedTareas] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTarea, setSelectedTarea] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [newTarea, setNewTarea] = useState({
    Titulo_Tarea: '',
    Descripcion_Tarea: '',
    Fecha_limite_Tarea: '',
    Tarea_Cumplida: ''
  });
  const [editTarea, setEditTarea] = useState({
    Titulo_Tarea: '',
    Descripcion_Tarea: '',
    Tarea_Cumplida: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchTareas = async () => {
    if (!userEmail) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://pruebatecnicabackend-production-e08f.up.railway.app/tareas-usuario/${encodeURIComponent(userEmail)}`);
      if (!response.ok) {
        throw new Error('Error en la respuesta de la API');
      }
      const data = await response.json();
      setTareas(data.map(tarea => ({
        ...tarea,
        Fecha_limite_Tarea: formatDateForInput(tarea.Fecha_limite_Tarea),
      })));
    } catch (err) {
      setError('No se pudieron obtener las tareas.');
      console.error('Error al obtener las tareas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTareas();
  }, [userEmail]);

  const handleExpandClick = (id) => {
    setExpandedTareas((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleMenuClick = (event, tarea) => {
    setAnchorEl(event.currentTarget);
    setSelectedTarea(tarea);
  };

  const handleMenuClose = (event, tarea) => {
    setAnchorEl(null);
    setSelectedTarea(null);
  };

  const handleDeleteClick = async () => {
    if (!selectedTarea) return;

    try {
      const response = await fetch(`https://pruebatecnicabackend-production-e08f.up.railway.app/eliminar-tarea/${selectedTarea.ID_Tarea}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error en la eliminación de la tarea');
      }

      await fetchTareas();
      handleMenuClose();
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
    }
  };

  const handleEditClick = () => {
    if (selectedTarea) {
      setEditTarea({
        Titulo_Tarea: selectedTarea.Titulo_Tarea,
        Descripcion_Tarea: selectedTarea.Descripcion_Tarea,
        Tarea_Cumplida: selectedTarea.Tarea_Cumplida
      });
      setOpenEditDialog(true);
    } else {
      console.error('No hay tarea seleccionada para editar.');
    }
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleOpenEditDialog = () => {
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleAddTareaChange = (event) => {
    const { name, value } = event.target;
    setNewTarea((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditTareaChange = (event) => {
    const { name, value } = event.target;
    setEditTarea((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTarea = async () => {
    if (!userEmail) {
      console.error('No se puede agregar la tarea: El email del usuario no está disponible.');
      return;
    }

    try {
      const response = await fetch(`https://pruebatecnicabackend-production-e08f.up.railway.app/agregar-tarea/${userEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newTarea,
          Fecha_limite_Tarea: formatDateForInput(newTarea.Fecha_limite_Tarea),
          Fecha_creacion_Tarea: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Error al agregar la tarea');
      }

      await fetchTareas();
      handleCloseAddDialog();
      setNewTarea({
        Titulo_Tarea: '',
        Descripcion_Tarea: '',
        Fecha_limite_Tarea: '',
        Tarea_Cumplida: '',
      });
    } catch (error) {
      console.error('Error al agregar la tarea:', error);
    }
  };

  const handleEditTarea = async () => {
    
    try {
      const response = await fetch(`https://pruebatecnicabackend-production-e08f.up.railway.app/actualizar-tarea/${selectedTarea.ID_Tarea}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editTarea),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la tarea');
        console.log ("Erorrrrrr")
      }

      await fetchTareas();
      handleCloseEditDialog();
      setEditTarea({
        Titulo_Tarea: '',
        Descripcion_Tarea: '',
        Tarea_Cumplida: '',
      });
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
    }
  };

  const filteredTareas = tareas
    .filter(tarea => {
      return (
        tarea.Titulo_Tarea.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (statusFilter ? tarea.Tarea_Cumplida === statusFilter : true)
      );
    });

  if (loading) return <p>Cargando tareas...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="tareas-container" style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', padding: '20px', width: "100%" }}>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px', gap: '10px' }}>
        <FormControl variant="outlined" style={{ minWidth: 120 }}>
          <InputLabel>Estado</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Estado"
          >
            <SelectMenuItem value="">Todos</SelectMenuItem>
            <SelectMenuItem value="Completada">Completada</SelectMenuItem>
            <SelectMenuItem value="Incompleta">Incompleta</SelectMenuItem>
        </Select>
        </FormControl>
        <TextField
          label="Buscar"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          Agregar Tarea
        </Button>
      </div>
      {filteredTareas.map((tarea) => (
        <Card key={tarea.ID_Tarea} style={{ margin: '10px', width: '100%', maxWidth: '600px' }}>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                {tarea.Titulo_Tarea.charAt(0)}
              </Avatar>
            }
            action={
              <IconButton
                aria-label="settings"
                onClick={(e) => handleMenuClick(e, tarea)}
              >
                <MoreVertIcon />
              </IconButton>
            }
            title={tarea.Titulo_Tarea}
            subheader={new Date(tarea.Fecha_creacion_Tarea).toLocaleDateString()}
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {tarea.Descripcion_Tarea}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton
              aria-label="expand"
              onClick={() => handleExpandClick(tarea.ID_Tarea)}
              expand={expandedTareas[tarea.ID_Tarea] || false}
            >
              <ExpandMoreIcon />
            </IconButton>
          </CardActions>
          <Collapse in={expandedTareas[tarea.ID_Tarea] || false} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Fecha Límite: {new Date(tarea.Fecha_limite_Tarea).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Estado: {tarea.Tarea_Cumplida}
              </Typography>
            </CardContent>
          </Collapse>
        </Card>
      ))}

      {/* Menu de opciones */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditClick}>
          <EditIcon />
          Editar
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <FavoriteIcon />
          Eliminar
        </MenuItem>
      </Menu>

      {/* Diálogo para agregar tarea */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Agregar Tarea</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="Titulo_Tarea"
            label="Título"
            type="text"
            fullWidth
            variant="standard"
            value={newTarea.Titulo_Tarea}
            onChange={handleAddTareaChange}
          />
          <TextField
            margin="dense"
            name="Descripcion_Tarea"
            label="Descripción"
            type="text"
            fullWidth
            variant="standard"
            value={newTarea.Descripcion_Tarea}
            onChange={handleAddTareaChange}
          />
          <TextField
            margin="dense"
            name="Fecha_limite_Tarea"
            label="Fecha Límite"
            type="datetime-local"
            fullWidth
            variant="standard"
            value={newTarea.Fecha_limite_Tarea}
            onChange={handleAddTareaChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Estado</InputLabel>
            <Select
              name="Tarea_Cumplida"
              value={newTarea.Tarea_Cumplida}
              onChange={handleAddTareaChange}
              label="Estado"
            >
              <SelectMenuItem value="Completada">Completada</SelectMenuItem>
              <SelectMenuItem value="Incompleta">Incompleta</SelectMenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancelar</Button>
          <Button onClick={handleAddTarea}>Agregar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para editar tarea */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Editar Tarea</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="Titulo_Tarea"
            label="Título"
            type="text"
            fullWidth
            variant="standard"
            value={editTarea.Titulo_Tarea}
            onChange={handleEditTareaChange}
          />
          <TextField
            margin="dense"
            name="Descripcion_Tarea"
            label="Descripción"
            type="text"
            fullWidth
            variant="standard"
            value={editTarea.Descripcion_Tarea}
            onChange={handleEditTareaChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Estado</InputLabel>
            <Select
              name="Tarea_Cumplida"
              value={editTarea.Tarea_Cumplida}
              onChange={handleEditTareaChange}
              label="Estado"
            >
              <SelectMenuItem value="Completada">Completada</SelectMenuItem>
              <SelectMenuItem value="Incompleta">Incompleta</SelectMenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancelar</Button>
          <Button onClick={handleEditTarea}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Tareas;