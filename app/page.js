"use client";

import { useState, useEffect } from "react";
import { collection, query, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { firestore } from "@/firebase";
import { Box, Typography, TextField, Button, IconButton, Grid, Card, CardContent, CardActions, Switch } from '@mui/material';
import { Delete, Edit, Download } from '@mui/icons-material';
import { CSVLink } from "react-csv";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemCount, setNewItemCount] = useState('');
  const [editItemId, setEditItemId] = useState(null);
  const [editItemName, setEditItemName] = useState('');
  const [editItemCount, setEditItemCount] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [sortDirection, setSortDirection] = useState('asc');

  const updateInventory = async () => {
    try {
      const snapshot = query(collection(firestore, 'inventory'));
      const docs = await getDocs(snapshot);
      const inventoryList = [];

      docs.forEach((doc) => {
        inventoryList.push({
          id: doc.id,
          name: doc.data().name || '',
          count: doc.data().count || 0,
        });
      });

      setInventory(inventoryList);
    } catch (error) {
      console.error("Error fetching inventory data: ", error);
    }
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleAddItem = async () => {
    if (!newItemName || !newItemCount) return;
    
    try {
      await addDoc(collection(firestore, 'inventory'), {
        name: newItemName,
        count: parseInt(newItemCount, 10),
      });
      setNewItemName('');
      setNewItemCount('');
      updateInventory();
    } catch (error) {
      console.error("Error adding item: ", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(firestore, 'inventory', id));
      updateInventory();
    } catch (error) {
      console.error("Error deleting item: ", error);
    }
  };

  const handleEdit = async (id) => {
    if (!editItemName || editItemCount === '') return;

    try {
      await updateDoc(doc(firestore, 'inventory', id), {
        name: editItemName,
        count: parseInt(editItemCount, 10),
      });
      setEditItemId(null);
      setEditItemName('');
      setEditItemCount('');
      updateInventory();
    } catch (error) {
      console.error("Error updating item: ", error);
    }
  };

  const sortedInventory = [...inventory].sort((a, b) => {
    if (sortDirection === 'asc') {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  const filteredInventory = sortedInventory.filter(item => (item.name || "").toLowerCase().includes(searchTerm.toLowerCase()));

  const csvData = filteredInventory.map(item => ({
    Name: item.name,
    Count: item.count,
  }));

  return (
    <Box
      padding={3}
      sx={{
        backgroundColor: darkMode ? '#121212' : '#f4f6f8',
        color: darkMode ? '#e0e0e0' : '#333',
        minHeight: '100vh',
      }}
    >
      <Box marginBottom={3} display="flex" justifyContent="space-between" alignItems="center">
        <Typography 
          variant='h4' 
          gutterBottom 
          align='center'
          sx={{
            color: darkMode ? '#e0e0e0' : '#333',
          }}
        >
          Inventory Management Dashboard
        </Typography>
        <Switch 
          checked={darkMode}
          onChange={() => setDarkMode(prev => !prev)}
          color="default"
          sx={{ color: darkMode ? '#e0e0e0' : '#333' }}
        />
      </Box>

      <Box 
        marginBottom={3} 
        display="flex" 
        flexDirection="column" 
        alignItems="center"
        sx={{
          backgroundColor: darkMode ? '#1e1e1e' : '#fff',
          padding: 3,
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <TextField
          label="Search Items"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }} alignItems="center">
          <TextField
            label="New Item Name"
            variant="outlined"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            sx={{ flex: 1, mb: { xs: 2, sm: 0 } }}
          />
          <TextField
            label="New Item Count"
            type="number"
            variant="outlined"
            value={newItemCount}
            onChange={(e) => setNewItemCount(e.target.value)}
            sx={{ flex: 1, mb: { xs: 2, sm: 0 } }}
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleAddItem}
            sx={{ height: '100%' }}
          >
            Add Item
          </Button>
        </Box>
      </Box>

      {editItemId && (
        <Box 
          marginBottom={3} 
          display="flex" 
          flexDirection="column" 
          alignItems="center"
          sx={{
            backgroundColor: darkMode ? '#1e1e1e' : '#fff',
            padding: 3,
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <TextField
            label="Edit Item Name"
            variant="outlined"
            value={editItemName}
            onChange={(e) => setEditItemName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Edit Item Count"
            type="number"
            variant="outlined"
            value={editItemCount}
            onChange={(e) => setEditItemCount(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={() => handleEdit(editItemId)}
          >
            Update Item
          </Button>
        </Box>
      )}

      <Box marginBottom={3} display="flex" justifyContent="space-between" alignItems="center">
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
        >
          Sort Alphabetically ({sortDirection === 'asc' ? 'Ascending' : 'Descending'})
        </Button>
        <CSVLink 
          data={csvData} 
          filename="inventory_data.csv"
          className="btn btn-primary"
        >
          <Button variant="contained" color="success" startIcon={<Download />}>
            Export to CSV
          </Button>
        </CSVLink>
      </Box>

      <Grid container spacing={2}>
        {filteredInventory.map((item) => (
          <Grid item xs={12} md={6} lg={4} key={item.id}>
            <Card 
              sx={{ 
                backgroundColor: darkMode ? '#1e1e1e' : '#fff', 
                color: darkMode ? '#e0e0e0' : '#333',
                boxShadow: 3, 
                borderRadius: 2,
                transition: '0.3s',
                '&:hover': {
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>{item.name}</Typography>
                <Typography variant="body2">Count: {item.count}</Typography>
              </CardContent>
              <CardActions>
                <IconButton color="primary" onClick={() => { 
                  setEditItemId(item.id);
                  setEditItemName(item.name);
                  setEditItemCount(item.count);
                }}>
                  <Edit />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(item.id)}>
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
