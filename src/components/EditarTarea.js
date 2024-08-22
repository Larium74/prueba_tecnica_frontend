import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
} from '@mui/material';
import axios from 'axios';

const EditarTarea = ({ tarea, open, handleClose, fetchTareas }) => {
  const [editTarea, setEditTarea] = useState({
    ID_Tarea: '',
    Titulo_Tarea: '',
    Descripcion_Tarea: '',
    Fecha_limite_Tarea: '',
    Tarea_Cumplida: '',
  });

  useEffect(() => {
    if (tarea) {
      setEditTarea({
        ID_Tarea: tarea.ID_Tarea,
        Titulo_Tarea: tarea.Titulo_Tarea,
        Descripcion_Tarea: tarea.Descripcion_Tarea,
        Fecha_limite_Tarea: tarea.Fecha_limite_Tarea,
        Tarea_Cumplida: tarea.Tarea_Cumplida,
      });
    }
  }, [tarea]);

  const handleEditTareaChange = (e) => {
    const { name, value } = e.target;
    setEditTarea((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditTarea = async () => {
    console.log("Editando tarea:", editTarea);
    try {
      const response = await axios.put(`/actualizar-tarea/${editTarea.ID_Tarea}`, editTarea);
      console.log("Respuesta de la API:", response);
      if (response.status === 200) {
        console.log("Tarea actualizada con éxito");
        handleClose(); // Cierra el diálogo
        fetchTareas(); // Refresca la lista de tareas después de la actualización
      } else {
        console.error("Error al actualizar la tarea");
      }
    } catch (error) {
      console.error("Error en la solicitud de actualización:", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Editar Tarea</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="Titulo_Tarea"
          label="Título"
          type="text"
          fullWidth
          value={editTarea.Titulo_Tarea}
          onChange={handleEditTareaChange}
        />
        <TextField
          margin="dense"
          name="Descripcion_Tarea"
          label="Descripción"
          type="text"
          fullWidth
          value={editTarea.Descripcion_Tarea}
          onChange={handleEditTareaChange}
        />
        <TextField
          margin="dense"
          name="Fecha_limite_Tarea"
          label="Fecha Límite"
          type="date"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          value={editTarea.Fecha_limite_Tarea}
          onChange={handleEditTareaChange}
        />
        <TextField
          margin="dense"
          name="Tarea_Cumplida"
          label="Estado"
          select
          fullWidth
          value={editTarea.Tarea_Cumplida}
          onChange={handleEditTareaChange}
        >
          <MenuItem value="Completada">Completada</MenuItem>
          <MenuItem value="Incompleta">Incompleta</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleEditTarea} color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditarTarea;