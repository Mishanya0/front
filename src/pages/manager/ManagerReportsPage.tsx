import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CardActions,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  SelectChangeEvent
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleIcon from '@mui/icons-material/People';
import { exportSalaries } from '../../services/salaryService';

const ManagerReportsPage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7) // Текущий месяц в формате YYYY-MM
  );
  const [reportType, setReportType] = useState<string>('salary');
  const [loadingReport, setLoadingReport] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMonth(event.target.value);
  };

  const handleReportTypeChange = (event: SelectChangeEvent) => {
    setReportType(event.target.value as string);
  };

  const handleGenerateSalaryReport = async () => {
    try {
      setLoadingReport(true);
      setError('');
      
      const blob = await exportSalaries(selectedMonth);
      
      // Создаем ссылку для скачивания файла
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `salary-report-${selectedMonth}.json`;
      link.click();
      
      setSuccess(true);
    } catch (err) {
      console.error('Error generating report:', err);
      setError('Произошла ошибка при формировании отчета');
    } finally {
      setLoadingReport(false);
    }
  };

  const handleGenerateAttendanceReport = () => {
    // Здесь будет логика для формирования отчета о посещаемости
    setSuccess(true);
  };

  const handleGenerateEmployeeReport = () => {
    // Здесь будет логика для формирования отчета о сотрудниках
    setSuccess(true);
  };

  const handleCloseSuccess = () => {
    setSuccess(false);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Отчеты и экспорт данных
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <TextField
            label="Месяц"
            type="month"
            value={selectedMonth}
            onChange={handleMonthChange}
            sx={{ minWidth: 200 }}
          />
          
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Тип отчета</InputLabel>
            <Select
              value={reportType}
              label="Тип отчета"
              onChange={handleReportTypeChange}
            >
              <MenuItem value="salary">Отчет по зарплатам</MenuItem>
              <MenuItem value="attendance">Отчет по посещаемости</MenuItem>
              <MenuItem value="employee">Отчет по сотрудникам</MenuItem>
            </Select>
          </FormControl>
          
          <Button 
            variant="contained" 
            color="primary"
            disabled={loadingReport}
            onClick={() => {
              if (reportType === 'salary') {
                handleGenerateSalaryReport();
              } else if (reportType === 'attendance') {
                handleGenerateAttendanceReport();
              } else if (reportType === 'employee') {
                handleGenerateEmployeeReport();
              }
            }}
          >
            {loadingReport ? 'Формирование...' : 'Сформировать отчет'}
          </Button>
        </Box>
      </Paper>
      
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Доступные отчеты
      </Typography>
      
      <Grid container spacing={3}>
        <Grid component="div" item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <DescriptionIcon fontSize="large" color="primary" />
              </Box>
              <Typography variant="h6" gutterBottom>
                Отчет по зарплатам
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Экспорт данных о заработных платах за выбранный месяц, включая базовые суммы, премии и вычеты.
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                onClick={() => {
                  setReportType('salary');
                  handleGenerateSalaryReport();
                }}
              >
                Сформировать
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid component="div" item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <CalendarMonthIcon fontSize="large" color="primary" />
              </Box>
              <Typography variant="h6" gutterBottom>
                Отчет по посещаемости
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Экспорт данных о посещаемости сотрудников за выбранный месяц, включая время прихода и ухода.
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                onClick={() => {
                  setReportType('attendance');
                  handleGenerateAttendanceReport();
                }}
              >
                Сформировать
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid component="div" item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <PeopleIcon fontSize="large" color="primary" />
              </Box>
              <Typography variant="h6" gutterBottom>
                Отчет по сотрудникам
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Экспорт данных о сотрудниках компании, включая информацию об отделах и должностях.
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                onClick={() => {
                  setReportType('employee');
                  handleGenerateEmployeeReport();
                }}
              >
                Сформировать
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
      
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
        message="Отчет успешно сформирован"
      />
    </Box>
  );
};

export default ManagerReportsPage; 