import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as moment from 'moment';

@Component({
  selector: 'app-mediamovel',
  templateUrl: './mediamovel.component.html',
  styleUrls: ['./mediamovel.component.css']
})
export class MediamovelComponent implements OnInit {

  ngOnInit() {
    // Define as margens e dimensões do gráfico
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Cria o elemento SVG
    const svg = d3.select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define a escala X (datas)
    const x = d3.scaleTime().range([0, width]);

    // Define a escala Y (número de casos)
    const y = d3.scaleLinear().range([height, 0]);

    // Define a linha do gráfico
    const line = d3.line()
      .x((d: any) => x(d.date))
      .y((d: any) => y(d.cases));

    // Carrega os dados da API de dados abertos do governo de São Paulo
    d3.json("https://dadosabertos.sa.gov.br/api/3/action/datastore_search?resource_id=3dc3bd49-15d2-4a39-bb56-2dedd1b409a9&limit=10000", (error, data) => {
      if (error) throw error;

      const cases = data.result.records.map(record => ({
        date: moment(record.semana_epidemiologica, "YYYY-[W]WW").toDate(),
        cases: record.casos
      }));

      // Define o domínio das escalas
      x.domain(d3.extent(cases, (d: any) => d.date));
      y.domain([0, d3.max(cases, (d: any) => d.cases)]);

      // Adiciona a linha do gráfico ao SVG
      svg.append("path")
        .datum(cases)
        .attr("class", "line")
        .attr("d", line);
    });
  }

}
