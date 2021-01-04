import routerx from 'express-promise-router';
import contactoController from '../controllers/ContactoController';
import auth from '../middlewares/auth';
const router=routerx();

router.post('/createOne',auth.verifyUser,contactoController.createOne);
router.get('/getAll',auth.verifyUser,contactoController.getAll);
//router.get('/list',auth.verifyAdministrador,usuarioController.list);
router.put('/updateOne:id',auth.verifyUser,contactoController.updateOne);
router.delete('/deleteOne:id',auth.verifyUser,contactoController.deleteOne);
export default router;