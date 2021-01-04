import routerx from 'express-promise-router';
import eventoController from '../controllers/EventoController';
import auth from '../middlewares/auth';
const router=routerx();

router.post('/createOne',auth.verifyUser,eventoController.createOne);
router.get('/getAll',auth.verifyUser,eventoController.getAll);
//router.get('/list',auth.verifyAdministrador,usuarioController.list);
router.put('/updateOne:id',auth.verifyUser,eventoController.updateOne);
router.delete('/deleteOne:id',auth.verifyUser,eventoController.deleteOne);
export default router;