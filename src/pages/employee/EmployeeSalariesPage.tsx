// @ts-ignore
import React, { useState, useEffect } from 'react';
// @ts-ignore
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
// @ts-ignore
import { useAuth } from '../../contexts/AuthContext';
// @ts-ignore
import { getEmployeeSalaries, getSalaryById } from '../../services/salaryService';
// @ts-ignore
import { Salary } from '../../types';
// @ts-ignore
import SalaryList from '../../components/SalaryList';

const EmployeeSalariesPage: React.FC = () => {
  const { user } = useAuth();
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSalary, setSelectedSalary] = useState<Salary | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Получаем данные о зарплатах сотрудника
  useEffect(() => {
    const fetchSalaries = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const data = await getEmployeeSalaries(user.id);
        setSalaries(data);
      } catch (err) {
        console.error('Error fetching salary data:', err);
        setError('Не удалось загрузить данные о зарплатах');
      } finally {
        setLoading(false);
      }
    };

    fetchSalaries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleViewDetails = async (id: number) => {
    try {
      const salary = await getSalaryById(id);
      if (salary) {
        setSelectedSalary(salary);
        setOpenDialog(true);
      }
    } catch (err) {
      console.error('Error fetching salary details:', err);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Форматирование суммы
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Расчет суммарных показателей
  const calculateTotals = () => {
    if (!salaries.length) return { total: 0, bonuses: 0, deductions: 0 };
    
    return salaries.reduce(
      (acc, salary) => {
        acc.total += salary.finalAmount;
        acc.bonuses += salary.bonuses;
        acc.deductions += salary.deductions;
        return acc;
      }, 
      { total: 0, bonuses: 0, deductions: 0 }
    );
  };

  const totals = calculateTotals();

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Мои зарплаты
      </Typography>
      
      {error && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'error.light', color: 'error.contrastText' }}>
          {error}
        </Paper>
      )}
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid component="div" item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Общая сумма выплат
              </Typography>
              <Typography variant="h4">
                {formatCurrency(totals.total)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid component="div" item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Премии
              </Typography>
              <Typography variant="h4">
                {formatCurrency(totals.bonuses)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid component="div" item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Вычеты
              </Typography>
              <Typography variant="h4">
                {formatCurrency(totals.deductions)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {loading ? (
        <Typography>Загрузка данных...</Typography>
      ) : (
        <SalaryList 
          salaries={salaries}
          onViewDetails={handleViewDetails}
        />
      )}
      
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Детали зарплаты</DialogTitle>
        <DialogContent>
          {selectedSalary && (
            <Grid container spacing={3}>
              <Grid component="div" item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Дата"
                  value={selectedSalary.date}
                  InputProps={{ readOnly: true }}
                  variant="filled"
                  margin="normal"
                />
              </Grid>
              
              <Grid component="div" item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Статус"
                  value={selectedSalary.status === 'paid' ? 'Выплачено' : 
                          selectedSalary.status === 'approved' ? 'Одобрено' : 'Ожидает'}
                  InputProps={{ readOnly: true }}
                  variant="filled"
                  margin="normal"
                />
              </Grid>
              
              <Grid component="div" item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Базовая сумма"
                  value={formatCurrency(selectedSalary.amount)}
                  InputProps={{ readOnly: true }}
                  variant="filled"
                  margin="normal"
                />
              </Grid>
              
              <Grid component="div" item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Премии"
                  value={formatCurrency(selectedSalary.bonuses)}
                  InputProps={{ readOnly: true }}
                  variant="filled"
                  margin="normal"
                />
              </Grid>
              
              <Grid component="div" item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Вычеты"
                  value={formatCurrency(selectedSalary.deductions)}
                  InputProps={{ readOnly: true }}
                  variant="filled"
                  margin="normal"
                />
              </Grid>
              
              <Grid component="div" item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Итоговая сумма"
                  value={formatCurrency(selectedSalary.finalAmount)}
                  InputProps={{ readOnly: true }}
                  variant="filled"
                  margin="normal"
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeeSalariesPage; 