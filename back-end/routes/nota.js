import routerx from 'express-promise-router';
import notaController from '../controllers/NotaController';
import auth from '../middlewares/auth';
const router=routerx();

router.post('/createOne',auth.verifyUser,notaController.createOne);
router.get('/getAll',auth.verifyUser,notaController.getAll);
//router.get('/list',auth.verifyAdministrador,usuarioController.list);
router.put('/updateOne:id',auth.verifyUser,notaController.updateOne);
router.delete('/deleteOne:id',auth.verifyUser,notaController.deleteOne);
export default router;