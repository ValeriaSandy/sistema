import routerx from 'express-promise-router';
import usuarioController from '../controllers/UsuarioController';
import auth from '../middlewares/auth';
const router=routerx();

router.post('/createOne',auth.verifyAdministrador,usuarioController.add);
router.get('/getAll',auth.verifyUsuario,usuarioController.query);
//router.get('/list',auth.verifyAdministrador,usuarioController.list);
router.put('/updateOne',auth.verifyAdministrador,usuarioController.update);
router.delete('/deleteOne',auth.verifyAdministrador,usuarioController.remove);
export default router;