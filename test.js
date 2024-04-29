const getParams = (url) => {
  return url
    .match(/\?(.+)/)[1]
    .split("&")
    .reduce((params, cur) => {
      const item = cur.split("=");
      return { ...params, [item[0]]: parseInt(item[1]) };
    }, {});
};

console.log(getParams("https://nowcoder.com/online?id=1&salas=1000"));
