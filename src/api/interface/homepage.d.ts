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
}
