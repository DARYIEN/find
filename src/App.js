/// Установите зависимости:
// npm install react-router-dom styled-components motion

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { motion, AnimatePresence } from 'motion/react';

// Глобальные стили с градиентом и стеклянным эффектом
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0; padding: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #333333;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

// Контейнер с эффектом стекла (glassmorphism)
const Container = styled.div`
  max-width: 720px;
  margin: 40px auto;
  padding: 30px 40px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

// Навигация с плавным эффектом
const Nav = styled.nav`
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
  a {
    text-decoration: none;
    color: rgba(255, 255, 255, 0.7);
    font-weight: 700;
    font-size: 18px;
    padding-bottom: 6px;
    transition: all 0.3s ease;
    border-bottom: 3px solid transparent;

    &.active {
      color: #fff;
      border-bottom: 3px solid #ffd700;
      box-shadow: 0 2px 8px #ffd700aa;
      border-radius: 4px;
    }

    &:hover:not(.active) {
      color: #d1c4e9;
    }
  }
`;

// Кнопка с градиентом и тенью
const Button = styled.button`
  background: linear-gradient(90deg, #ffb347 0%, #ffcc33 100%);
  color: #3a0ca3;
  border: none;
  padding: 10px 22px;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 700;
  font-size: 15px;
  box-shadow: 0 4px 14px rgba(255, 204, 51, 0.6);
  transition: background 0.3s ease;

  &:hover {
    background: linear-gradient(90deg, #ffcc33 0%, #ffb347 100%);
  }

  &:disabled {
    background: #bbb;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

// Заголовок страницы
const PageTitle = styled.h2`
  color: #fff;
  margin-bottom: 15px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.3);
`;

// --- Финансовый дневник ---
const EventCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.25);
  padding: 18px 24px;
  border-radius: 16px;
  margin-bottom: 14px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.3);
  color: #1a1a1a;
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
  background: rgba(255,255,255,0.3);
  color: #1a1a1a;
  font-weight: 600;
  box-shadow: inset 0 0 8px rgba(0,0,0,0.1);
  transition: background 0.3s ease;

  &:focus {
    outline: none;
    background: rgba(255,255,255,0.5);
  }
`;

// --- Достижения ---
const AchievementCard = styled(motion.div)`
  background: ${(props) => (props.completed ? 'rgba(56, 161, 105, 0.25)' : 'rgba(49, 130, 206, 0.25)')};
  border-left: 8px solid ${(props) => (props.completed ? '#38a169' : '#3182ce')};
  padding: 20px 24px;
  border-radius: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #1a1a1a;
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
`;

const ProgressBarContainer = styled.div`
  background: rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  overflow: hidden;
  height: 18px;
  width: 180px;
  margin-top: 10px;
  box-shadow: inset 0 0 8px rgba(0,0,0,0.1);
`;

const ProgressBarFill = styled.div`
  background: #ffd700;
  height: 100%;
  width: ${(props) => props.percent}%;
  transition: width 0.6s ease;
  border-radius: 20px 0 0 20px;
`;

// --- Образовательный центр ---
const LessonCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.3);
  padding: 20px 24px;
  border-radius: 20px;
  margin-bottom: 16px;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
  color: #1a1a1a;
  font-weight: 600;
  user-select: none;

  &:hover {
    background: rgba(255, 255, 255, 0.5);
  }
`;

// --- Компоненты страниц ---

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
      <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '20px' }}>
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
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>Нет событий в выбранной категории.</p>
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
            <em style={{ fontStyle: 'normal', color: '#555' }}>{event.category}</em>
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
      description: 'Отложите 10% от вашего дохода за месяц и получите награду.',
    },
    {
      id: 2,
      title: 'Откажись от ненужной покупки',
      completed: false,
      claimed: false,
      progress: 45,
      description: 'Сократите импульсивные траты и улучшите финансовую дисциплину.',
    },
    {
      id: 3,
      title: 'Накопи на поездку мечты',
      completed: false,
      claimed: false,
      progress: 60,
      description: 'Поставьте цель и двигайтесь к ней шаг за шагом.',
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
      <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '20px' }}>
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
              <p style={{ margin: '6px 0', color: '#444' }}>{ach.description}</p>
              <ProgressBarContainer aria-label={`Прогресс: ${ach.progress}%`}>
                <ProgressBarFill percent={ach.progress} />
              </ProgressBarContainer>
            </div>
            <div>
              {ach.completed ? (
                ach.claimed ? (
                  <span style={{ color: '#38a169', fontWeight: '700' }}>Награда получена</span>
                ) : (
                  <Button onClick={() => handleClaimReward(ach.id)}>Получить награду</Button>
                )
              ) : (
                <span style={{ color: '#a0aec0', fontWeight: '700' }}>В процессе</span>
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
      <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '20px' }}>
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
                style={{ marginTop: '10px', overflow: 'hidden', color: '#222' }}
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

// --- Основное приложение ---
export default function App() {
  return (
    <>
      <GlobalStyle />
      <Router>
        <Container>
          <h1 style={{ color: '#fff', textAlign: 'center', marginBottom: '40px', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
            Z-aналитика
          </h1>
          <Nav>
            <NavLink to="/" end>Дневник</NavLink>
            <NavLink to="/achievements">Достижения</NavLink>
            <NavLink to="/education">Обучение</NavLink>
          </Nav>
          <Routes>
            <Route path="/" element={<Diary />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/education" element={<Education />} />
          </Routes>
        </Container>
      </Router>
    </>
  );
}
