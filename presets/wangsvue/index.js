import accordion from './accordion/index.js';
import autocomplete from './autocomplete/index.js';
import avatar from './avatar/index.js';
import avatargroup from './avatargroup/index.js';
import badge from './badge/index.js';
import badgedirective from './badgedirective/index.js';
import button from './button/index.js';
import calendar from './calendar/index.js';
import card from './card/index.js';
import carousel from './carousel/index.js';
import cascadeselect from './cascadeselect/index.js';
import checkbox from './checkbox/index.js';
import chip from './chip/index.js';
import chips from './chips/index.js';
import colorpicker from './colorpicker/index.js';
import confirmpopup from './confirmpopup/index.js';
import contextmenu from './contextmenu/index.js';
import datatable from './datatable/index.js';
import dataview from './dataview/index.js';
import dataviewlayoutoptions from './dataviewlayoutoptions/index.js';
import dialog from './dialog/index.js';
import dialogconfirm from './dialogconfirm/index.js';
import dialogform from './dialogform/index.js';
import divider from './divider/index.js';
import dock from './dock/index.js';
import dropdown from './dropdown/index.js';
import fieldset from './fieldset/index.js';
import form from './form/index';
import global from './global.js';
import image from './image/index.js';
import inlinemessage from './inlinemessage/index.js';
import inputbadge from './inputbadge/index.js';
import inputgroup from './inputgroup/index.js';
import inputgroupaddon from './inputgroupaddon/index.js';
import inputmask from './inputmask/index.js';
import inputnumber from './inputnumber/index.js';
import inputotp from './inputotp/index.js';
import inputphonenumber from './inputphonenumber/index.js';
import inputswitch from './inputswitch/index.js';
import inputtext from './inputtext/index.js';
import knob from './knob/index.js';
import listbox from './listbox/index.js';
import megamenu from './megamenu/index.js';
import menu from './menu/index.js';
import menubar from './menubar/index.js';
import message from './message/index.js';
import multiselect from './multiselect/index.js';
import orderlist from './orderlist/index.js';
import organizationchart from './organizationchart/index.js';
import overlaypanel from './overlaypanel/index.js';
import paginator from './paginator/index.js';
import panel from './panel/index.js';
import panelmenu from './panelmenu/index.js';
import password from './password/index.js';
import picklist from './picklist/index.js';
import progressbar from './progressbar/index.js';
import radiobutton from './radiobutton/index.js';
import rating from './rating/index.js';
import ripple from './ripple/index.js';
import scrollpanel from './scrollpanel/index.js';
import scrolltop from './scrolltop/index.js';
import selectbutton from './selectbutton/index.js';
import sidebar from './sidebar/index.js';
import skeleton from './skeleton/index.js';
import slider from './slider/index.js';
import splitbutton from './splitbutton/index.js';
import steps from './steps/index.js';
import tabmenu from './tabmenu/index.js';
import tabview from './tabview/index.js';
import tag from './tag/index.js';
import terminal from './terminal/index.js';
import textarea from './textarea/index.js';
import tieredmenu from './tieredmenu/index.js';
import timeline from './timeline/index.js';
import toast from './toast/index.js';
import togglebutton from './togglebutton/index.js';
import toolbar from './toolbar/index.js';
import tooltip from './tooltip/index.js';
import tree from './tree/index.js';
import treeselect from './treeselect/index.js';
import treetable from './treetable/index.js';
import tristatecheckbox from './tristatecheckbox/index.js';
import validatormessage from './validatormessage/index.js';

const directives = {
  badge: badgedirective,
  ripple,
  tooltip,
};

const wangsvue = {
  global,
  directives,

  //Forms
  form,
  autocomplete,
  dropdown,
  inputnumber,
  inputphonenumber,
  inputotp,
  inputtext,
  inputbadge,
  calendar,
  checkbox,
  radiobutton,
  inputswitch,
  selectbutton,
  slider,
  chips,
  rating,
  multiselect,
  togglebutton,
  cascadeselect,
  listbox,
  colorpicker,
  inputgroup,
  inputgroupaddon,
  inputmask,
  knob,
  treeselect,
  tristatecheckbox,
  textarea,
  password,
  validatormessage,

  //Buttons
  button,
  splitbutton,

  //Data
  paginator,
  datatable,
  treetable,
  tree,
  dataview,
  dataviewlayoutoptions,
  organizationchart,
  orderlist,
  picklist,
  timeline,

  //Panels
  accordion,
  panel,
  fieldset,
  card,
  tabview,
  divider,
  toolbar,
  scrollpanel,

  //Menu
  contextmenu,
  menu,
  menubar,
  steps,
  tieredmenu,
  panelmenu,
  megamenu,
  dock,
  tabmenu,

  //Overlays
  dialog,
  dialogconfirm,
  dialogform,
  overlaypanel,
  sidebar,
  confirmpopup,

  //Messages
  message,
  inlinemessage,
  toast,

  //Media
  carousel,

  //Misc
  badge,
  avatar,
  avatargroup,
  tag,
  chip,
  progressbar,
  skeleton,
  scrolltop,
  terminal,
  image,
};

export default wangsvue;
