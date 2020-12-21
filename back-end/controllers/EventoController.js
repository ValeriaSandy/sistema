import models from '../models';
export default {
    getAll:async (req, res) => {
        let usuarioId = req.usuario._id;     
          try {
            const eventoDB = await models.Evento.find({usuarioId});
            return res.json(eventoDB);
          } catch (error) {
            return res.status(400).json({
              mensaje: "Error al crear nota",
              error
            });
          }
        },

    createOne: async (req, res) => {
       try{
          const {nombre, detalle, inicio, final, color}=req.body; 
          const usuarioId = req.usuario._id
          const Newevento = new models.Nota({nombre,detalle,inicio,final,color,usuarioId});
          await Newevento.save();
          return res.json(Newevento);       
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
          const eventoUpdated = await models.Evento.findByIdAndUpdate(
            _id,
            {$set: body}, 
            { useFindAndModify: false });
          res.json(eventoUpdated);
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
          const eventoDeleted = await models.Evento.findByIdAndDelete(_id);
          if(!eventoDeleted){
              return res.status(400).json({
                  mensaje: 'No se encontró el id indicado',
                  error
                })
          }
          res.json(eventoDeleted);
          } catch (error) {
              return res.status(400).json({
                mensaje: 'Ocurrio un error',
                error
              })
            }
          },
}
