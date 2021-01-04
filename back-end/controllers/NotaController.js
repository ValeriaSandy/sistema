import models from '../models';
import token from '../services/token';
export default {
    getAll:async (req, res) => {  
          try {
            let usuario = await token.decode(req.headers.token);
            let usuarioId = usuario.id  
            const notasDB = await models.Nota.find({usuarioId});
            return res.json(notasDB);
          } catch (error) {
            return res.status(400).json({
              message: "Error al crear nota",
              error
            });
          }
        },

    createOne: async (req, res) => {
       try{
        let usuario = await token.decode(req.headers.token);
        let usuarioId = usuario.id;
          const {titulo,descripcion}=req.body; 
          const Newnota = new models.Nota({titulo,descripcion,usuarioId});
          await Newnota.save();
          return res.json(Newnota);       
         } catch (error) {
          return res.status(500).json({
            message: 'Ocurrio un error',
            error
          });
        }
        },
    updateOne: async (req, res, next) => {
          const _id = req.params.id;
          const body = req.body;
       try {
          const notasUpdated = await models.Nota.findByIdAndUpdate(
            _id,
            {$set: body}, 
            { useFindAndModify: false });
          res.status(200).json(notasUpdated);
      } catch (error) {
            res.status(400).json({
            message: 'Ocurrio un error',
          });
          next(error);  
          }
      },
    deleteOne: async (req, res) => {
          const _id = req.params.id;
        try{
          const notasDeleted = await models.Nota.findByIdAndDelete({_id});
          if(!notasDeleted){
              return res.status(400).json({
                  message: 'No se encontró el id indicado',
                  error
                })
          }
          res.status(200).json(notasDeleted);
          } catch (error) {
                res.status(400).json({
                message: 'Ocurrio un error',
              });
              next(error);
            }
          },
}
