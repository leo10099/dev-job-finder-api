module.exports = async page => {
  await page
    .waitForSelector('.iO', {
      timeout: 3000
    })
    .catch(e => {
      return e;
    });

  const computrabajo_jobs = await page.evaluate(async () => {
    // Buscar el contenedor de cada aviso

    const jobs = [];
    const parents = await document.querySelectorAll('.iO');

    await parents.forEach(async parent => {
      /* Guardar el título, la ubicacación, la URL, la fecha de publicación
      y la agencia o empresa que lo publicó*/
      let json = {};
      /* Chequear si el aviso se publicó hoy, si no es de hoy, saltearlo*/
      const date = parent.querySelector('.dO').innerText.split(',')[0];
      if (!date.includes('Hoy') || !date.includes('Ayer')) {
        return;
      }
      json.date = date;
      json.title = parent.querySelector('h2.tO').innerText;
      json.url = parent.querySelector('h2.tO > a').href;
      /* Por alguna razón, Computrabajo trata distino a "Kaizen Recursos Humanos",
      no lo wrapea en un link como al resto, por eso se trata
      ese caso de manera especial" */
      json.publisher =
        parent.querySelector('span a.it-blank').innerText ||
        'Kaizen Recursos Humanos';

      const [, , location] = parent.querySelectorAll('span a');
      /*Si el trabajo figura como "Buenos Aires-GBA", guardarlo como "Buenos Aires" */
      json.location = location.innerText.split('-')[0];
      jobs.push(json);
    });

    return jobs;
  });
  return computrabajo_jobs;
};
