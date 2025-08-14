import { ECOption } from "@/components/ECharts/config";
import mitt from "mitt";

type Events = {
  openThemeDrawer: void;
  open: void;
  close: void;
  collapse: void;
  fullScreen: { options: ECOption; title: string };
};

const mittBus = mitt<Events>();

export default mittBus;
