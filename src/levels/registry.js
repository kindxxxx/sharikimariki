import Plinko from './Plinko.jsx';
import Funnel from './Funnel.jsx';
import Conveyor from './Conveyor.jsx';
import Hammer from './Hammer.jsx';
import Wind from './Wind.jsx';

/**
 * ЕДИНЫЙ РЕЕСТР УРОВНЕЙ
 * Чтобы добавить новый уровень:
 * 1. Создайте файл уровня в `src/levels/NewLevel.jsx`
 * 2. Зарегистрируйте его здесь в `levelRegistry`
 */
export const levelRegistry = [
  Plinko,
  Funnel,
  Conveyor,
  Hammer,
  Wind
];
