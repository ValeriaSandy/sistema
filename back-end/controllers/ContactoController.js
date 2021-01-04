import models from '../models';
import token from '../services/token';
export default {
    getAll:async (req, res) => { 
          try {
            let usuario = await token.decode(req.headers.token);
            let usuarioId = usuario.id;
            const contactoDB = await models.Contacto.find({usuarioId});
            return res.json(contactoDB);
          } catch (error) {
            return res.status(400).json({
              mensaje: "Error al crear nota",
              error
            });
          }
        },

    createOne: async (req, res) => {
       try{
        let usuario = await token.decode(req.headers.token);
        let usuarioId = usuario.id;
          const {nombre, apellido, telefono, direccion, email}=req.body; 
          const Newcontacto = new models.Contacto({nombre, apellido, telefono,direccion, email, usuarioId});
        //  Newcontacto.usuario = req.usuario.id;
          await Newcontacto.save();
          return res.json(Newcontacto);       
         } catch (error) {
          return res.status(500).json({
            mensaje: 'Ocurrio un error',
            error
          });
        }
        },
    updateOne: async (req, res, next) => {
          const _id = req.params.id;
          const body = req.body;
       try {
          const contactoUpdated = await models.Contacto.findByIdAndUpdate(
            _id,
            {$set: body}, 
            { useFindAndModify: false });
         return res.status(200).json(contactoUpdated);
      } catch (error) {
           res.status(500).send({
            message: 'Ocurrio un error',
          });
          next(error);  
          }
      },
    deleteOne: async (req, res, next) => {
          const _id = req.params.id;
        try{
          const contactoDeleted = await models.Contacto.findByIdAndDelete({_id});
          if(!contactoDeleted){
            return res.status(400).json({
                message: 'No se encontró el id indicado',
                error
              })
        }
          res.status(200).json(contactoDeleted);
           } catch (error) {
               res.status(500).send({
                message: 'Ocurrio un error',
              });
              next(error);
            }
          },
}
