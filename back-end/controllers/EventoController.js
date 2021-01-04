import models from '../models';
import token from '../services/token';
export default {
    getAll:async (req, res) => {    
          try {
            let usuario = await token.decode(req.headers.token);
            let usuarioId = usuario.id  
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
          const {name, details, start, end, color}=req.body; 
          let usuario = await token.decode(req.headers.token);
          let usuarioId = usuario.id;
          const Newevento = new models.Evento({name,details,start,end,color,usuarioId});
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
          const  _id = req.params.id;
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
          const _id = req.params.id;
        try{
          const eventoDeleted = await models.Evento.findByIdAndDelete({_id});
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
