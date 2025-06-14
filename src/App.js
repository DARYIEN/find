// Установите зависимости:
// npm install react-router-dom styled-components motion

import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { motion, AnimatePresence } from 'motion/react';

// Темы с дополнительными цветами для рамок и советов
const darkTheme = {
  body: '#121212',
  text: '#e0e0e0',
  glassBackground: 'rgba(18, 18, 18, 0.6)',
  glassBorder: 'rgba(255, 255, 255, 0.5)', // ярче для рамок в дневнике и обучении
  primary: '#ffd700',
  primaryShadow: '#ffd700aa',
  secondary: '#3182ce',
  secondaryLight: 'rgba(49, 130, 206, 0.25)',
  success: '#38a169',
  successLight: 'rgba(56, 161, 105, 0.25)',
  warning: '#fbbf24',
  warningLight: 'rgba(171, 145, 0, 0.3)', // тёмно-жёлтый фон для предупреждений
  buttonBackground: 'linear-gradient(90deg, #ffb347 0%, #ffcc33 100%)',
  buttonText: '#3a0ca3',
  buttonShadow: 'rgba(255, 204, 51, 0.6)',
  diaryCardBorder: 'rgba(255, 255, 255, 0.5)',
  educationCardBorder: 'rgba(255, 255, 255, 0.5)',
  adviceWarningBg: 'rgba(171, 145, 0, 0.3)',
  adviceWarningText: '#fff',
  advicePositiveBg: 'rgba(16, 185, 129, 0.25)',
  advicePositiveText: '#e0f2f1',
};

const lightTheme = {
  body: '#ffffff',
  text: '#121212',
  glassBackground: 'rgba(255, 255, 255, 0.15)',
  glassBorder: 'rgba(0, 0, 0, 0.1)',
  primary: '#ffd700',
  primaryShadow: '#ffd700aa',
  secondary: '#3182ce',
  secondaryLight: 'rgba(49, 130, 206, 0.25)',
  success: '#38a169',
  successLight: 'rgba(56, 161, 105, 0.25)',
  warning: '#fbbf24',
  warningLight: '#fef3c7',
  buttonBackground: 'linear-gradient(90deg, #ffb347 0%, #ffcc33 100%)',
  buttonText: '#3a0ca3',
  buttonShadow: 'rgba(255, 204, 51, 0.6)',
  diaryCardBorder: 'rgba(0, 0, 0, 0.1)',
  educationCardBorder: 'rgba(0, 0, 0, 0.1)',
  adviceWarningBg: '#fef3c7',
  adviceWarningText: '#92400e',
  advicePositiveBg: '#d1fae5',
  advicePositiveText: '#065f46',
};

// Контекст темы
const ThemeToggleContext = createContext();
export const useTheme = () => useContext(ThemeToggleContext);

// Глобальные стили
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0; padding: 0;
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background 0.3s ease, color 0.3s ease;
  }
  a {
    color: ${({ theme }) => theme.text};
  }
`;

// Стили компонентов
const Container = styled.div`
  max-width: 720px;
  margin: 40px auto;
  padding: 30px 40px;
  background: ${({ theme }) => theme.glassBackground};
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid ${({ theme }) => theme.glassBorder};
  color: ${({ theme }) => theme.text};
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
  a {
    text-decoration: none;
    color: ${({ theme }) => theme.text};
    font-weight: 700;
    font-size: 18px;
    padding-bottom: 6px;
    transition: all 0.3s ease;
    border-bottom: 3px solid transparent;

    &.active {
      color: ${({ theme }) => theme.primary};
      border-bottom: 3px solid ${({ theme }) => theme.primary};
      box-shadow: 0 2px 8px ${({ theme }) => theme.primaryShadow};
      border-radius: 4px;
    }

    &:hover:not(.active) {
      color: ${({ theme }) => theme.secondary};
    }
  }
`;

const Button = styled.button`
  background: ${({ theme }) => theme.buttonBackground};
  color: ${({ theme }) => theme.buttonText};
  border: none;
  padding: 10px 22px;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 700;
  font-size: 15px;
  box-shadow: 0 4px 14px ${({ theme }) => theme.buttonShadow};
  transition: background 0.3s ease;

  &:hover {
    filter: brightness(1.1);
  }

  &:disabled {
    background: #555;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const PageTitle = styled.h2`
  color: ${({ theme }) => theme.text};
  margin-bottom: 15px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.3);
`;

const EventCard = styled(motion.div)`
  background: ${({ theme }) => theme.glassBackground};
  border: 1.5px solid ${({ theme }) => theme.diaryCardBorder};
  padding: 18px 24px;
  border-radius: 16px;
  margin-bottom: 14px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  backdrop-filter: blur(8px);
  color: ${({ theme }) => theme.text};
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FilterBar = styled.div`
  margin-bottom: 25px;
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
`;

const Select = styled.select`
  padding: 8px 14px;
  border-radius: 12px;
  border: none;
  background: ${({ theme }) => theme.glassBackground};
  color: ${({ theme }) => theme.text};
  font-weight: 600;
  box-shadow: inset 0 0 8px rgba(0,0,0,0.1);
  transition: background 0.3s ease;

  &:focus {
    outline: none;
    background: ${({ theme }) => theme.primary};
    color: #000;
  }
`;

const AchievementCard = styled(motion.div)`
  background: ${({ completed, theme }) => completed ? theme.successLight : theme.secondaryLight};
  border-left: 8px solid ${({ completed, theme }) => completed ? theme.success : theme.secondary};
  padding: 20px 24px;
  border-radius: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.text};
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
`;

const ProgressBarContainer = styled.div`
  background: ${({ theme }) => theme.glassBackground};
  border-radius: 20px;
  overflow: hidden;
  height: 18px;
  width: 180px;
  margin-top: 10px;
  box-shadow: inset 0 0 8px rgba(0,0,0,0.1);
`;

const ProgressBarFill = styled.div`
  background: ${({ theme }) => theme.primary};
  height: 100%;
  width: ${({ percent }) => percent}%;
  transition: width 0.6s ease;
  border-radius: 20px 0 0 20px;
`;

const LessonCard = styled(motion.div)`
  background: ${({ theme }) => theme.glassBackground};
  border: 1.5px solid ${({ theme }) => theme.educationCardBorder};
  padding: 20px 24px;
  border-radius: 20px;
  margin-bottom: 16px;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
  color: ${({ theme }) => theme.text};
  font-weight: 600;
  user-select: none;

  &:hover {
    background: ${({ theme }) => theme.primary};
    color: #000;
  }
`;

const JourneyContainer = styled.div`
  background: ${({ theme }) => theme.glassBackground};
  border-radius: 20px;
  padding: 20px 30px;
  margin-bottom: 30px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
  backdrop-filter: blur(8px);
  border: 1px solid ${({ theme }) => theme.glassBorder};
  color: ${({ theme }) => theme.text};
`;

const Map = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Stop = styled.div`
  position: relative;
  text-align: center;
  width: 100px;
  color: ${({ completed, theme }) => completed ? theme.success : theme.secondary};
  font-weight: ${({ completed }) => completed ? '700' : '400'};
  user-select: none;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    right: -50px;
    width: 50px;
    height: 6px;
    background: ${({ completed, theme }) => completed ? theme.success : theme.secondaryLight};
    z-index: -1;
    border-radius: 3px;
    transform: translateY(-50%);
  }

  &:last-child::after {
    content: none;
  }
`;

const Emoji = styled.div`
  font-size: 32px;
  margin-bottom: 6px;
`;

const AdviceCard = styled.div`
  background: ${({ type, theme }) =>
    type === 'warning' ? theme.adviceWarningBg : theme.advicePositiveBg};
  color: ${({ type, theme }) =>
    type === 'warning' ? theme.adviceWarningText : theme.advicePositiveText};
  border-left: 6px solid
    ${({ type, theme }) => (type === 'warning' ? theme.warning : theme.success)};
  padding: 15px 20px;
  border-radius: 12px;
  margin-bottom: 15px;
  font-weight: 600;
`;

// Заголовок с динамическим цветом для Прогресс и советы
const SectionHeader = styled.h3`
  margin-bottom: 20px;
  color: ${({ theme }) => (theme.body === '#ffffff' ? '#121212' : '#fff')};
  text-shadow: ${({ theme }) =>
    theme.body === '#ffffff' ? 'none' : '0 2px 8px rgba(0,0,0,0.5)'};
`;

// --- Страницы ---

function Diary() {
  const [events] = useState([
    { id: 1, date: '2025-06-10', description: 'Потратил 500₽ на книги', category: 'Образование' },
    { id: 2, date: '2025-06-12', description: 'Накопил 2000₽ на поездку', category: 'Сбережения' },
    { id: 3, date: '2025-06-13', description: 'Оплатил подписку на музыку — 299₽', category: 'Развлечения' },
    { id: 4, date: '2025-06-14', description: 'Получил стипендию 15000₽', category: 'Доход' },
  ]);
  const [filter, setFilter] = useState('Все');

  const filteredEvents = filter === 'Все' ? events : events.filter(e => e.category === filter);

  return (
    <>
      <PageTitle>Финансовый дневник</PageTitle>
      <p style={{ marginBottom: '20px' }}>
        Отслеживайте расходы и доходы, чтобы лучше понимать свои финансы.
      </p>
      <FilterBar>
        <Select value={filter} onChange={e => setFilter(e.target.value)} aria-label="Фильтр по категории">
          <option>Все</option>
          <option>Образование</option>
          <option>Сбережения</option>
          <option>Развлечения</option>
          <option>Доход</option>
        </Select>
      </FilterBar>
      <AnimatePresence>
        {filteredEvents.length === 0 && (
          <p>Нет событий в выбранной категории.</p>
        )}
        {filteredEvents.map((event, i) => (
          <EventCard
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            aria-label={`Событие: ${event.description} от ${event.date}`}
          >
            <div>
              <strong>{event.date}:</strong> {event.description}
            </div>
            <em style={{ fontStyle: 'normal', color: '#bbb' }}>{event.category}</em>
          </EventCard>
        ))}
      </AnimatePresence>
    </>
  );
}

function Achievements() {
  const [achievements, setAchievements] = useState([
    {
      id: 1,
      title: 'Сохрани 10% дохода',
      completed: true,
      claimed: false,
      progress: 100,
      description: 'Отложите 10% от вашего дохода за месяц и получите награду',
    },
    {
      id: 2,
      title: 'Откажись от ненужной покупки',
      completed: false,
      claimed: false,
      progress: 45,
      description: 'Сократите импульсивные траты и улучшите финансовую дисциплину',
    },
    {
      id: 3,
      title: 'Накопи на поездку мечты',
      completed: false,
      claimed: false,
      progress: 60,
      description: 'Поставьте цель и двигайтесь к ней шаг за шагом',
    },
  ]);

  const handleClaimReward = (id) => {
    setAchievements((prev) =>
      prev.map((ach) =>
        ach.id === id ? { ...ach, claimed: true } : ach
      )
    );
  };

  return (
    <>
      <PageTitle>Достижения</PageTitle>
      <p style={{ marginBottom: '20px' }}>
        Мотивируйте себя и формируйте полезные финансовые привычки.
      </p>
      <AnimatePresence>
        {achievements.map((ach, i) => (
          <AchievementCard
            key={ach.id}
            completed={ach.completed}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            aria-label={`Достижение: ${ach.title}, прогресс ${ach.progress} процентов`}
          >
            <div>
              <strong>{ach.title}</strong>
              <p style={{ margin: '6px 0', color: '#888' }}>{ach.description}</p>
              <ProgressBarContainer aria-label={`Прогресс: ${ach.progress}%`}>
                <ProgressBarFill percent={ach.progress} />
              </ProgressBarContainer>
            </div>
            <div>
              {ach.completed ? (
                ach.claimed ? (
                  <span style={{ color: darkTheme.success, fontWeight: '700' }}>Награда получена</span>
                ) : (
                  <Button onClick={() => handleClaimReward(ach.id)}>Получить награду</Button>
                )
              ) : (
                <span style={{ color: '#888', fontWeight: '700' }}>В процессе</span>
              )}
            </div>
          </AchievementCard>
        ))}
      </AnimatePresence>
    </>
  );
}

function Education() {
  const lessons = [
    {
      id: 1,
      title: 'Автоматизированное бюджетирование',
      content: `Приложения с ИИ помогают автоматически классифицировать ваши расходы и доходы, упрощая составление бюджета и достижение финансовых целей. Используйте встроенные алгоритмы для контроля финансов без лишних усилий.`,
    },
    {
      id: 2,
      title: 'Эффективная экономия',
      content: `ИИ помогает управлять сбережениями, предлагая стратегии и автоматически откладывая часть дохода. Вы можете ставить цели и видеть прогресс в реальном времени.`,
    },
    {
      id: 3,
      title: 'Индивидуальные советы',
      content: `На основе анализа ваших финансовых привычек ИИ предлагает персонализированные рекомендации по экономии и инвестициям, помогая принимать более взвешенные решения.`,
    },
    {
      id: 4,
      title: 'Экономия времени',
      content: `Автоматизация рутинных задач, таких как оплата счетов и сверка выписок, позволяет вам сосредоточиться на важных делах и жить полной жизнью.`,
    },
    {
      id: 5,
      title: 'Безопасность данных',
      content: `Все финансовые данные шифруются и защищаются двухфакторной аутентификацией. Вы будете получать уведомления о подозрительной активности и сможете быстро реагировать.`,
    },
  ];

  const [selectedLesson, setSelectedLesson] = useState(null);

  return (
    <>
      <PageTitle>Образовательный центр</PageTitle>
      <p style={{ marginBottom: '20px' }}>
        Узнайте, как искусственный интеллект помогает поколению Z управлять финансами.
      </p>
      {lessons.map((lesson) => (
        <LessonCard
          key={lesson.id}
          onClick={() =>
            setSelectedLesson(selectedLesson === lesson.id ? null : lesson.id)
          }
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          aria-expanded={selectedLesson === lesson.id}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setSelectedLesson(selectedLesson === lesson.id ? null : lesson.id);
            }
          }}
        >
          <strong>{lesson.title}</strong>
          <AnimatePresence>
            {selectedLesson === lesson.id && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ marginTop: '10px', overflow: 'hidden', color: '#bbb' }}
              >
                {lesson.content}
              </motion.p>
            )}
          </AnimatePresence>
        </LessonCard>
      ))}
    </>
  );
}

function ProgressAndAdvice() {
  const goals = [
    { id: 1, title: 'Накопить на гаджет', completed: true },
    { id: 2, title: 'Создать подушку безопасности', completed: false },
    { id: 3, title: 'Начать инвестировать', completed: false },
  ];

  const adviceList = [
    { id: 1, type: 'positive', text: 'Вы уже накопили 50% от цели "Накопить на гаджет". Отличный прогресс!' },
    { id: 2, type: 'warning', text: 'Вы часто тратите на кафе. Попробуйте готовить дома — это поможет сэкономить.' },
    { id: 3, type: 'positive', text: 'Рекомендуем открыть накопительный счёт с повышенным процентом.' },
  ];

  return (
    <JourneyContainer aria-label="Визуальное отображение прогресса и персонализированные советы">
      <SectionHeader>Ваш финансовый путь</SectionHeader>
      <Map>
        {goals.map((goal) => (
          <Stop key={goal.id} completed={goal.completed} tabIndex={0} aria-label={`${goal.title} ${goal.completed ? 'достигнута' : 'не достигнута'}`}>
            <Emoji>{goal.completed ? '🏆' : '⏳'}</Emoji>
            <div>{goal.title}</div>
          </Stop>
        ))}
      </Map>

      <SectionHeader>Персонализированные советы</SectionHeader>
      {adviceList.map(advice => (
        <AdviceCard key={advice.id} type={advice.type} tabIndex={0} role="article" aria-label={`Совет: ${advice.text}`}>
          {advice.text}
        </AdviceCard>
      ))}
    </JourneyContainer>
  );
}

// Переключатель темы
const ThemeToggleButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  background: ${({ theme }) => theme.buttonBackground};
  color: ${({ theme }) => theme.buttonText};
  border: none;
  padding: 10px 18px;
  border-radius: 30px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 14px ${({ theme }) => theme.buttonShadow};
  transition: background 0.3s ease;
  z-index: 1000;

  &:hover {
    filter: brightness(1.1);
  }
`;

// Основное приложение
export default function App() {
  const [theme, setTheme] = useState(darkTheme);

  const toggleTheme = () => {
    setTheme(theme === darkTheme ? lightTheme : darkTheme);
  };

  return (
    <ThemeToggleContext.Provider value={{ theme, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Router>
          <ThemeToggleButton onClick={toggleTheme} aria-label="Переключить тему">
            {theme === darkTheme ? 'Светлая тема' : 'Тёмная тема'}
          </ThemeToggleButton>
          <Container>
            <h1 style={{ color: theme.text, textAlign: 'center', marginBottom: '40px', textShadow: theme.body === '#121212' ? '0 2px 8px rgba(0,0,0,0.4)' : 'none' }}>
              Z-aналитика
            </h1>
            <Nav>
              <NavLink to="/" end>Дневник</NavLink>
              <NavLink to="/achievements">Достижения</NavLink>
              <NavLink to="/education">Обучение</NavLink>
              <NavLink to="/progress">Прогресс и советы</NavLink>
            </Nav>
            <Routes>
              <Route path="/" element={<Diary />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/education" element={<Education />} />
              <Route path="/progress" element={<ProgressAndAdvice />} />
            </Routes>
          </Container>
        </Router>
      </ThemeProvider>
    </ThemeToggleContext.Provider>
  );
}


