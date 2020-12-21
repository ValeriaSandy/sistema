import models from '../models';
export default {
    getAll:async (req, res) => {
        let usuarioId = req.usuario._id;     
          try {
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
          const {nombre, apellido, telefono, direccion, email}=req.body; 
          const usuarioId = req.usuario._id
          const Newcontacto = new models.Contacto({nombre, apellido, telefono,direccion, email,usuarioId});
          await Newcontacto.save();
          return res.json(Newcontacto);       
         } catch (error) {
          return res.status(500).json({
            mensaje: 'Ocurrio un error',
            error
          });
        }
        },
    updateOne: async (req, res) => {
          const { _id } = req.params;
          const body = req.body;
       try {
          const contactoUpdated = await models.Contacto.findByIdAndUpdate(
            _id,
            {$set: body}, 
            { useFindAndModify: false });
          res.json(contactoUpdated);
      } catch (error) {
          return res.status(400).json({
            mensaje: 'Ocurrio un error',
            error
          })  
          }
      },
    deleteOne: async (req, res) => {
          const { _id } = req.params;
        try{
          const contactoDeleted = await models.Contacto.findByIdAndDelete(_id);
          if(!contactoDeleted){
              return res.status(400).json({
                  mensaje: 'No se encontró el id indicado',
                  error
                })
          }
          res.json(contactoDeleted);
          } catch (error) {
              return res.status(400).json({
                mensaje: 'Ocurrio un error',
                error
              })
            }
          },
}
