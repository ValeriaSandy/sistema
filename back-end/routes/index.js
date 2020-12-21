import routerx from 'express-promise-router';
import notaRouter from './nota';
import eventoRouter from './evento';
import usuarioRouter from './usuario';
import contactoRouter from './contacto';
const router=routerx();

router.use('/nota',notaRouter);
router.use('/evento',eventoRouter);
router.use('/usuario',usuarioRouter);
router.use('/contacto',contactoRouter);
export default router;