import models from '../models';
export default {
    getAll:async (req, res) => {
        let usuarioId = req.usuario._id;     
          try {
            const notasDB = await models.Nota.find({usuarioId});
            return res.json(notasDB);
          } catch (error) {
            return res.status(400).json({
              mensaje: "Error al crear nota",
              error
            });
          }
        },

    createOne: async (req, res) => {
       try{
          const {titulo,descripcion}=req.body; 
          const usuarioId = req.usuario._id
          const Newnota = new models.Nota({titulo,descripcion,usuarioId});
          await Newnota.save();
          return res.json(Newnota);       
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
          const notasUpdated = await models.Nota.findByIdAndUpdate(
            _id,
            {$set: body}, 
            { useFindAndModify: false });
          res.json(notasUpdated);
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
          const notasDeleted = await models.Nota.findByIdAndDelete(_id);
          if(!notasDeleted){
              return res.status(400).json({
                  mensaje: 'No se encontró el id indicado',
                  error
                })
          }
          res.json(notasDeleted);
          } catch (error) {
              return res.status(400).json({
                mensaje: 'Ocurrio un error',
                error
              })
            }
          },
}
