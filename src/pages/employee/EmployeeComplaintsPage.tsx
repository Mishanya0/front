// @ts-ignore
import React, { useState, useEffect } from 'react';
// @ts-ignore
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider
} from '@mui/material';
// @ts-ignore
import { useAuth } from '../../contexts/AuthContext';
// @ts-ignore
import { getEmployeeComplaints } from '../../services/complaintService';
// @ts-ignore
import { Complaint } from '../../types';
// @ts-ignore
import ComplaintForm from '../../components/ComplaintForm';
// @ts-ignore
import ComplaintList from '../../components/ComplaintList';

const EmployeeComplaintsPage: React.FC = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchComplaints = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await getEmployeeComplaints(user.id);
      setComplaints(data);
    } catch (err) {
      console.error('Error fetching complaints:', err);
      setError('Не удалось загрузить отправленные жалобы');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Отправить жалобу в бухгалтерию
      </Typography>
      
      <Grid container spacing={3}>
        <Grid component="div" item xs={12} md={6}>
          <ComplaintForm />
        </Grid>
        
        <Grid component="div" item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Мои жалобы
            </Typography>
            
            <Divider sx={{ mb: 2 }} />
            
            {loading ? (
              <Typography>Загрузка данных...</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : complaints.length === 0 ? (
              <Typography>У вас пока нет отправленных жалоб</Typography>
            ) : (
              <ComplaintList 
                complaints={complaints} 
                canRespond={false} 
              />
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmployeeComplaintsPage; 