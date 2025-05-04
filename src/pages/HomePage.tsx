import React from 'react';
import {
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  Container
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Иконки для ролей
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CalculateIcon from '@mui/icons-material/Calculate';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Перенаправление на соответствующую страницу в зависимости от роли
  const navigateByRole = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    switch (user.role) {
      case 'employee':
        navigate('/employee/salaries');
        break;
      case 'accountant':
        navigate('/accountant/salaries');
        break;
      case 'manager':
        navigate('/manager/employees');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <Container>
      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Система управления заработными платами
        </Typography>
        
        {!user ? (
          // Для неавторизованных пользователей
          <Box>
            <Typography variant="body1" paragraph>
              Добро пожаловать в систему управления заработными платами. Пожалуйста, авторизуйтесь для доступа к функциям системы.
            </Typography>
            
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={() => navigate('/login')}
              sx={{ mt: 2 }}
            >
              Войти в систему
            </Button>
          </Box>
        ) : (
          // Для авторизованных пользователей
          <Box>
            <Typography variant="h6" gutterBottom>
              Добро пожаловать, {user.name}!
            </Typography>
            
            <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto', my: 4 }}>
              <Typography variant="body1" paragraph>
                Вы вошли в систему как: <strong>{user.role === 'employee' ? 'Сотрудник' : user.role === 'accountant' ? 'Бухгалтер' : 'Руководитель'}</strong>
              </Typography>
              
              <Button 
                variant="contained" 
                color="primary"
                onClick={navigateByRole}
              >
                Перейти в основной раздел
              </Button>
            </Paper>
            
            <Typography variant="h5" gutterBottom sx={{ mt: 6, mb: 3 }}>
              Доступные действия
            </Typography>
            
            <Grid container spacing={4} justifyContent="center">
              {/* Карточки возможностей для сотрудника */}
              {user.role === 'employee' && (
                <>
                  <Grid component="div" item xs={12} sm={6} md={4}>
                    <Card>
                      <CardContent>
                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                          <AccountBalanceWalletIcon fontSize="large" color="primary" />
                        </Box>
                        <Typography variant="h6" gutterBottom>
                          Просмотр зарплат
                        </Typography>
                        <Typography variant="body2">
                          Просмотр всех полученных заработных плат и премий
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small" onClick={() => navigate('/employee/salaries')}>
                          Перейти
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                  
                  <Grid component="div" item xs={12} sm={6} md={4}>
                    <Card>
                      <CardContent>
                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                          <CalculateIcon fontSize="large" color="primary" />
                        </Box>
                        <Typography variant="h6" gutterBottom>
                          Расчетные ведомости
                        </Typography>
                        <Typography variant="body2">
                          Просмотр расчетных ведомостей за выбранный период
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small" onClick={() => navigate('/employee/reports')}>
                          Перейти
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                </>
              )}
              
              {/* Карточки возможностей для бухгалтера */}
              {user.role === 'accountant' && (
                <>
                  <Grid component="div" item xs={12} sm={6} md={4}>
                    <Card>
                      <CardContent>
                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                          <AccountBalanceWalletIcon fontSize="large" color="primary" />
                        </Box>
                        <Typography variant="h6" gutterBottom>
                          Управление зарплатами
                        </Typography>
                        <Typography variant="body2">
                          Управление выплатами, добавление премий и расчет вычетов
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small" onClick={() => navigate('/accountant/salaries')}>
                          Перейти
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                  
                  <Grid component="div" item xs={12} sm={6} md={4}>
                    <Card>
                      <CardContent>
                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                          <CalculateIcon fontSize="large" color="primary" />
                        </Box>
                        <Typography variant="h6" gutterBottom>
                          Вычеты и премии
                        </Typography>
                        <Typography variant="body2">
                          Управление налоговыми вычетами и премиальными выплатами
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small" onClick={() => navigate('/accountant/deductions')}>
                          Перейти
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                </>
              )}
              
              {/* Карточки возможностей для руководителя */}
              {user.role === 'manager' && (
                <>
                  <Grid component="div" item xs={12} sm={6} md={4}>
                    <Card>
                      <CardContent>
                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                          <SupervisorAccountIcon fontSize="large" color="primary" />
                        </Box>
                        <Typography variant="h6" gutterBottom>
                          Работа с сотрудниками
                        </Typography>
                        <Typography variant="body2">
                          Просмотр информации о сотрудниках и управление данными
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small" onClick={() => navigate('/manager/employees')}>
                          Перейти
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                  
                  <Grid component="div" item xs={12} sm={6} md={4}>
                    <Card>
                      <CardContent>
                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                          <AccountBalanceWalletIcon fontSize="large" color="primary" />
                        </Box>
                        <Typography variant="h6" gutterBottom>
                          Управление зарплатами
                        </Typography>
                        <Typography variant="body2">
                          Контроль и утверждение выплаты заработных плат
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small" onClick={() => navigate('/manager/salaries')}>
                          Перейти
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default HomePage; 