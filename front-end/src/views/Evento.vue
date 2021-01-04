<template>
<default-dashboard>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat color="white">
          <v-btn color="primary" dark @click.stop="dialog = true">
            Nuevo Evento
          </v-btn>
          <v-btn outlined class="mr-4" @click="setToday">
            Hoy
          </v-btn>
          <v-btn fab text small @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab text small @click="next">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <div class="flex-grow-1"></div>
          <v-menu bottom right>
            <template v-slot:activator="{ on }">
              <v-btn outlined v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Dia</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Semana</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Mes</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 dias</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>

      <v-dialog v-model="dialog" max-width="500">
        <v-card>
          <v-card-title>
                  Crear Evento
          </v-card-title>
          <v-divider/>
          <v-container>
          <v-card-text>
            <v-form >
              <v-text-field v-model="name" type="text" label="nombre del evento"></v-text-field>
              <v-text-field v-model="details" type="text" label="detalle"></v-text-field>
              <v-text-field v-model="start" type="date" label="inicio"></v-text-field>
              <v-text-field v-model="end" type="date" label="fin"></v-text-field>
              <v-text-field v-model="color" type="color" label="seleccione un color"></v-text-field>
            </v-form>
               <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v">  </div>
          </v-card-text>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
          <v-btn type="submit" color="primary" class="mr-4" @click.stop="dialog = false" @click="addEvent">Crear Evento</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogDate" max-width="500">
        <v-card>
          <v-container>
            <v-form @submit.prevent="addEvent">
              <v-text-field v-model="name" type="text" label="nombre del evento"></v-text-field>
              <v-text-field v-model="details" type="text" label="detalle"></v-text-field>
              <v-text-field v-model="start" type="date" label="inicio"></v-text-field>
              <v-text-field v-model="end" type="date" label="fin"></v-text-field>
              <v-text-field v-model="color" type="color" label="seleccione un color"></v-text-field>
              <v-btn type="submit" color="primary" class="mr-4" @click.stop="dialogDate = false">
                Crear Evento
              </v-btn>
            </v-form>
               <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v">  </div>
          </v-container>
        </v-card>
      </v-dialog>

<v-sheet height="600">
  <v-calendar
  ref="calendar"
  v-model="focus"
  color="primary"
  :events="events"
  :event-color="getEventColor"
  :event-margin-bottom="3"
  :now="today"
  :type="type"
  @click:event="showEvent"
  @click:more="viewDay"
  @click:date="setDialogDate"
  @change="updateRange"
  :weekdays="[1, 2, 3, 4, 5, 6, 0]"
  locale="es"
  :short-weekdays="false"
  ></v-calendar>
  <v-menu
  v-model="selectedOpen"
  :close-on-content-click="false"
  :activator="selectedElement"
  offset-x
  >
  <v-card color="grey lighten-4" :width="350" flat>
    <v-toolbar :color="selectedEvent.color" dark>
      <v-btn @click="deleteEvent(selectedEvent)" icon> <v-icon>mdi-delete</v-icon> </v-btn>
      <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
      <div class="flex-grow-1"></div>
    </v-toolbar>

    <v-card-text>
      <form v-if="currentlyEditing !== selectedEvent._id">
        {{selectedEvent.name}} - {{selectedEvent.details}}
      </form>

      <form v-else>
         <v-text-field  type="text" v-model="selectedEvent.name" label="Editar Nombre"> </v-text-field>
         <v-textarea type="text" v-model="selectedEvent.details" label="Editar Descripcion"> </v-textarea>
    </form>
  </v-card-text>

  <v-card-actions>
    <v-btn text color="secondary" @click="selectedOpen = false"> Cerrar </v-btn>
    <v-btn v-if="currentlyEditing !== selectedEvent._id" tex  @click.prevent="editEvent(selectedEvent._id)">Editar </v-btn>
    <v-btn text v-else type="submit" @click.prevent="updateEvent(selectedEvent)"> Guardar </v-btn>
  </v-card-actions>
</v-card>
</v-menu>
</v-sheet>
</v-col>
</v-row>
</default-dashboard>
</template>

<script>
import DefaultDashboard from '../components/DefaultDashboard'

export default {
  data: () => ({
    today: new Date().toISOString().substr(0, 10),
    focus: new Date().toISOString().substr(0, 10),
    type: 'month',
    typeToLabel: {
      month: 'Month',
      week: 'Week',
      day: 'Day',
      '4day': '4 Days',
    },
    name: null,
    details: null,
    start: null,
    end: null,
    color: '#1976D2', // default event color
    newDetails: null,
    currentlyEditing: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    dialog: false,
    dialogDate: false,
    valida: 0,
    validaMensaje: [],
  }),
  mounted () {
    this.getEvents()
  },
  components:{
      DefaultDashboard
  },
  computed: {
    title () {
      const { start, end } = this
      if (!start || !end) {
        return ''
      }
      const startMonth = this.monthFormatter(start)
      const endMonth = this.monthFormatter(end)
      const suffixMonth = startMonth === endMonth ? '' : endMonth
      const startYear = start.year
      const endYear = end.year
      const suffixYear = startYear === endYear ? '' : endYear
      const startDay = start.day + this.nth(start.day)
      const endDay = end.day + this.nth(end.day)
      switch (this.type) {
        case 'month':
        return `${startMonth} ${startYear}`
        case 'week':
        case '4day':
        return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`
        case 'day':
        return `${startMonth} ${startDay} ${startYear}`
      }
      return ''
    },
    monthFormatter () {
      return this.$refs.calendar.getFormatter({
        timeZone: 'UTC', month: 'long',
      })
    }
  },
   created(){ 
    this.getEvents();
  },

  methods: {
    async getEvents () {
      let header={"Token" : this.$store.state.token};
      let configuracion= {headers : header};
      let uri = 'evento/getAll';
      const response = await this.axios.get(uri,configuracion)
      this.events = response.data;
    },
    setDialogDate( { date }) {
      this.dialogDate = true
      this.focus = date
    },
    viewDay ({ date }) {
      this.focus = date
      this.type = 'day'
    },
    getEventColor (event) {
      return event.color
    },
    setToday () {
      this.focus = this.today
    },
    prev () {
      this.$refs.calendar.prev()
    },
    next () {
      this.$refs.calendar.next()
    },
    validar(){
                this.valida=0;
                this.validaMensaje=[];
                if(!this.name){
                    this.validaMensaje.push('Escriba el nombre del evento.');
                }
                if(!this.details){
                    this.validaMensaje.push('Escriba los detalle del evento.');
                }
                 if(!this.start){
                    this.validaMensaje.push('Ingrese la fecha de inicio.');
                }
                 if(!this.end){
                    this.validaMensaje.push('Ingrese la fecha de fin .');
                }
                 if(!this.color){
                    this.validaMensaje.push('Seleccione un color.');
                }
                
                if (this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            },
    async addEvent (){
      let header={"Token" : this.$store.state.token};
      let configuracion= {headers : header};
      let uri = 'evento/createOne';
       if (this.validar()){
                    return;
                }
      this.start = new Date(this.start).toISOString().substring(0,10);
      this.end = new Date(this.end).toISOString().substring(0,10);
     
      await this.axios.post(uri, {
        name: this.name,
        details: this.details,
        start: this.start,
        end: this.end,
        color: this.color,
      },configuracion)
      this.name = '',
      this.details = '',
      this.start = '',
      this.end = '',
      this.color = ''
      this.selectedOpen = false,
      this.getEvents()
    },
    
    async updateEvent (selectedEvent) {
      try{
      let header={"Token" : this.$store.state.token};
      let configuracion= {headers : header};
      let uri = `evento/updateOne${this.selectedEvent._id}`;
      await this.axios.put(uri,{
        name: selectedEvent.name,
        details: selectedEvent.details
      },configuracion)
      this.selectedOpen = false,
      this.currentlyEditing = null
      this.getEvents()
      }catch (error) {
          console.log(error);
      }
    },
    editEvent (_id) {
      this.currentlyEditing = _id
    },
    async deleteEvent (selectedEvent) {
      let header={"Token" : this.$store.state.token};
      let configuracion= {headers : header};
      let uri = `evento/deleteOne${this.selectedEvent._id}`;
      await this.axios.delete(uri,configuracion)
        this.selectedOpen = false,
        this.getEvents()

    },
    showEvent ({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        setTimeout(() => this.selectedOpen = true, 10)
      }
      if (this.selectedOpen) {
        this.selectedOpen = false
        setTimeout(open, 10)
      } else {
        open()
      }
      nativeEvent.stopPropagation()
    },
    updateRange ({ start, end }) {
      this.start = start
      this.end = end
    },
    nth (d) {
      return d > 3 && d < 21
      ? 'th'
      : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10]
    }
  }
}
</script>
