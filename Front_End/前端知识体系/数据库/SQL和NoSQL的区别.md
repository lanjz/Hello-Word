# SQL和NoSQL区别

## 概念

- SQL：关系型数据库

- NoSQL: 非关系型数据库

## 存储方式

- SQL：存储在特定结构的表中

- NoSQL：存储方式更加灵活，可以是 JSON，哈希等其它形式

## 表/数据集合的数据的关系

- SQL：必须定义好表结构后才能添加数据，例如定义表的主键(primary key)，索引(index),触发器(trigger),存储过程(stored procedure)等

- NoSQL:数据可以在任何时候任何地方添加，不需要先定义表

## 外部数据存储

- SQL：需要增加外部关联数据的话，规范化做法是在原表中增加一个外键，关联外部数据表,例如需要在借阅表中增加审核人信息，先建立一个审核人表

  ![](https://upload-images.jianshu.io/upload_images/1744544-1ac579409de4e80f.png?imageMogr2/auto-orient/strip|imageView2/2/w/758/format/webp)
  
  再在原来的借阅人表中增加审核人外键
  
  ![](https://upload-images.jianshu.io/upload_images/1744544-c2a801eed3188870.png?imageMogr2/auto-orient/strip|imageView2/2/w/752/format/webp)
  
  这样如果我们需要更新审核人个人信息的时候只需要更新审核人表而不需要对借阅人表做更新。

- NoSQL: 除了这种规范化的外部数据表做法以外，我们还能用如下的非规范化方式把外部数据直接放到原数据集中，以提高查询效率。缺点也比较明显，更新审核人数据的时候将会比较麻烦。

  ![](https://upload-images.jianshu.io/upload_images/1744544-456469a12715e9b5.png?imageMogr2/auto-orient/strip|imageView2/2/w/763/format/webp)
  
