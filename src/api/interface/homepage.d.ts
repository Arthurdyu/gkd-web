export declare namespace Homepage {
  namespace Home {
    type ResHome = {
      /**
       * 内容
       */
      content: string;
      /**
       * 创建时间
       */
      createDate: string;
      id: string;
      /**
       * 图片
       */
      photo: string;
      /**
       * 标题
       */
      title: string;
    }[];
    type ResSchool = Array<{
      logo: string;
      name: string;
    }>;
    interface Data {
      /**
       * 竞赛数量
       */
      comptitionNumber: number;
      /**
       * 教法数量
       */
      teachNumber: number;
    }
  }
  //request 和respond的接口类型
  interface ReqSunburst {
    Animal?: number;
    Animal_Domestic_Animal?: number;
    Animal_Wild_Animal?: number;
    Environment?: number;
    Env_Animal_Associated?: number;
    Env_Plant_Associated?: number;
    Env_Soil?: number;
    Env_Water?: number;
    Food?: number;
    Food_Animal_Origin?: number;
    Food_feed_Animal_Origin?: number;
    Food_feed_Plant_Origin?: number;
    Food_Plant_Origin?: number;
    Human?: number;
    Human_Clinical?: number;
    Human_Non_Clincal?: number;
    /**
     * ID 编号
     */
    id: string;
  }
  interface ResSunburst {
    Animal?: number;
    //Animal_Aquatic_Animal?: number;
    Animal_Domestic_Animal?: number;
    Animal_Wild_Animal?: number;
    Environment?: number;
    Env_Animal_Associated?: number;
    Env_Food_Associated?: number;
    Env_Plant_Associated?: number;
    Env_Soil?: number;
    Env_Water?: number;
    Food?: number;
    Food_Animal_Origin?: number;
    Food_feed_Animal_Origin?: number;
    Food_feed_Plant_Origin?: number;
    Food_Plant_Origin?: number;
    Human?: number;
    Human_Clinical?: number;
    Human_Non_Clincal?: number;
  }
}
