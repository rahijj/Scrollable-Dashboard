import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as helper from '../helperFunctions';
import { max, min } from 'd3';

interface P {
	width: number;
	height: number;
	cardInd: number;
	data: any;
	isVisible: boolean;
	section: string;
	headHeight: number;
}
const LineGraph: React.FC<P> = ({ width, height, data, cardInd, isVisible, section, headHeight }) => {
	const [filter_val, set_filter] = useState('Overall');
	const [filter_Comb, set_filterComb] = useState('None');
	const [filter_Education, set_filterEducation] = useState('None');
	const [filter_List, set_filterList] = useState({
		type: 'None',
		filters: [''],
	});

	const [graphicFilter, set_graphic] = useState(999);
	// These are margins are set to make space for Plot Labels.
	const margin = { top: 60, right: 20, bottom: 60, left: 45 };
	const innerWidth = width - margin.left - margin.right;
	const innerHeight = height - margin.top - margin.bottom;

	function Line(index: number) {
		let plotTitle = '';
		let legend: Record<string, string> = {};
		let linearScale: any;
		let bandScale: any;

		const navy = '#344a62';
		const grey = 'grey';
		const orange = 'orange';
		const Colors: string[] = [navy, orange, grey];

		const yLabel = 'yLabel';
		const xLabel = 'xLabel';
		const g = d3.select('#LineSVG');
		const gNodes = g.select('.nodes');
		const gLinks = g.select('.links');

		const passedList: [string, number][][] = [];

		let toolList: Record<string, Record<string, string>> = {};
		if (filter_List.type != 'None') {
			let filt = '';

			/* This for loop decides if and how the split by filter should split the data into
			different lines simultaneously displayed on a graph.
			It also sets  the title and legends for that selected filter. */

			for (let i = 0; i < filter_List.filters.length; i++) {
				filt = filter_List.filters[i];
				switch (filter_List.type) {
					case 'Education':
						// Example Code //
						// f_edu = filt;
						// if (index <= 2) {
						//     plotTitle = 'Income Change split by Education';
						// } else if (index === 3) {
						//     plotTitle = 'Spending Change split by Education';
						// }
						// legend['Less than Matric'] = Colors[0];
						// legend[filter_List.filters[1]] = Colors[1];
						// legend[filter_List.filters[2]] = Colors[2];

						singleLine(Colors[i], i);

						break;

					case 'case2':
						// Your Code Here //
						singleLine(Colors[i], i);

						break;
					default:
						console.error('No Switch statement exists!');
				}
			}
		} else {
			if (index <= 2) {
				plotTitle = 'Scroll 1';
				if (index === 1) {
					plotTitle = 'Scroll 2';
				} else if (index == 2) {
					plotTitle = 'Scroll 3';
				}
			}
			singleLine(navy, 0);
		}

		/* This allows lonnger plot titles to split into two lines for the mobile version */
		if (window.matchMedia('(max-width: 767px)').matches) {
			helper.plotTitle(g, innerWidth, plotTitle, true);
		} else {
			helper.plotTitle(g, innerWidth, plotTitle);
		}

		/* "singleLine" creats one line at a time. It takes in 2 arguments. The 1st arg specifies the color of the line and legend,
		and the 2nd arg sets the unique line number. A unique line number is required to differntiate between inputs with te same
		key/x value if lines are displayed simultaneously. */
		function singleLine(color: string, iter: number) {
			const data_obj: Record<number, number> = {};

			data_obj[1] = 0 * ((index + 1) / 3);
			data_obj[4] = -25 * ((index + 1) / 3);
			data_obj[7] = -10 * ((index + 1) / 3);

			const tooltipTable: Record<string, Record<string, string>> = {};

			Object.keys(data_obj).forEach((e: any) => {
				// '# + String(iter)' is added so that the tooltip generator can differentiate
				// between points with same x labels but different y labels.
				tooltipTable[e + '#' + String(iter)] = {
					Value: data_obj[e].toFixed(2) + '%',
					Mean: 'x',
					'25 %': 'x',
					'50 %': 'x',
					'75 %': 'x',
					Count: 'x',
				};
			});

			toolList = Object.assign({}, toolList, tooltipTable);

			let passedData: [string, number][];

			passedData = Object.entries(data_obj);

			if (iter === 0) {
				linearScale = d3
					.scaleLinear()
					.domain([
						Math.min(-45, 1.3 * Number(min(Object.values(data_obj)))),
						Math.max(15, 1.3 * Number(max(Object.values(data_obj)))),
					])
					.range([innerHeight, 0]);
				bandScale = d3
					.scaleTime()
					//@ts-ignore
					.domain([new Date(2020, 0, 1), new Date(2020, 10, 31)])
					.range([0, innerWidth]);
			}

			passedList.push(passedData);

			if (filter_List.type === 'None') {
				legend = {
					Legend: color,
				};
			}

			const xAxis = d3
				.axisBottom(bandScale)
				.tickValues([
					new Date(2020, 0, 1),
					new Date(2020, 1, 1),
					new Date(2020, 4, 1),
					new Date(2020, 7, 1),
					new Date(2020, 9, 1),
					new Date(2020, 11, 1),
				])
				//@ts-ignore
				.tickFormat(d3.timeFormat('%b'));

			const tick: any = '';

			helper.showXAxis(xAxis, g, innerHeight, innerWidth, xLabel);
			helper.showXGrid(xAxis.tickSize(-innerHeight).tickFormat(tick), g);

			const yAxis = d3.axisLeft(linearScale);
			helper.showYAxis(yAxis, g, innerHeight, innerWidth, yLabel, margin);
			helper.showYGrid(yAxis.tickSize(-innerWidth).tickFormat(tick), g);

			g.select('.yGrid')
				.selectAll('g.tick')
				.filter((d) => d == 0)
				.select('line')
				.style('stroke-width', 2)
				.style('stroke', 'red');
		}

		helper.makeLineMonth({
			gLinks: gLinks,
			bandScale: bandScale,
			linearScale: linearScale,
			passedList: passedList,
		});

		helper.showLegend(legend, g);

		if (filter_List.type !== 'None') {
			g.selectAll('.legend').attr(
				'transform',
				`translate(${bandScale(new Date(2020, 11, 1)) - 130},${linearScale(linearScale.domain()[0] + 14)})`
			);
		} else {
			g.selectAll('.legend').attr(
				'transform',
				`translate(${bandScale(new Date(2020, 11, 1)) - 80},${linearScale(linearScale.domain()[0] + 13)})`
			);
		}

		let combinedList: [string, number][] = [];
		combinedList = helper.flattenNodes({ targetList: combinedList, origList: passedList });

		helper.highlightLine({
			data: combinedList,
			selection: gNodes,
			bandScale: bandScale,
			linearScale: linearScale,
			tooltipTable: toolList,
			month: true,
		});

		g.attr('transform', `translate(${margin.left},${margin.top})`);
	}

	const scrollVis = (index: number) => {
		const g = d3.select('#LineSVG');

		helper.createGrid(g, innerHeight);
		helper.createAxis(g, innerHeight);
		helper.generateElements([['legend', 1]], 'legend', g, 'g');
		helper.generateElements([['links', 1]], 'links', g, 'g');
		helper.generateElements([['nodes', 1]], 'nodes', g, 'g');

		Line(index);
	};

	const pan = d3.select('.' + section);

	useEffect(() => {
		if (cardInd === 1) {
			set_filterComb('card1');
		} else if (cardInd === 2) {
			set_filterComb('card2');
		} else {
			set_filterComb('None');
		}
	}, [cardInd, isVisible]);

	useEffect(() => {
		set_filter('Overall');
		// set_filterList to display Multiple lines at the same time using
		// different filter values
		set_filterList({
			type: 'None',
			filters: [],
		});
		if (filter_Comb != 'None') {
			if (filter_Comb === 'Education') {
				set_filterList({
					type: filter_Comb,
					filters: ['Dropped out Before Matric', 'Matric', 'More than Matric'],
				});
			} else {
				set_filter(filter_Comb);
			}
		}
	}, [filter_Comb]);

	useEffect(() => {
		if (isVisible) {
			pan.selectAll('.card').style('opacity', function (d, i) {
				return i === cardInd ? 1 : 0.3;
			});

			d3.select('#LineSVG').style('opacity', 1);
			scrollVis(cardInd);
		} else {
			pan.selectAll('.card').style('opacity', 0.4);

			d3.select('#LineSVG').style('opacity', 0.4);
		}
		set_graphic(999);
	}, [isVisible, cardInd, data, width, height, filter_val, filter_List, headHeight]);

	return (
		<div id="LineTemp" className="section" style={{ width: `${width}`, height: `${(height + headHeight) * 4}px` }}>
			<div id="graphic" className={section} style={{ zIndex: graphicFilter }}>
				<div className="card">
					<div className="content">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis facilisis suscipit dui accumsan
						mattis.
                    </div>
				</div>
				<div className="card">
					<div className="content">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis facilisis suscipit dui accumsan
						mattis.
                    </div>
				</div>
				<div className="card">
					<div className="content">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis facilisis suscipit dui accumsan
						mattis.
                    </div>
				</div>
			</div>
			<div id="vis" style={{ height: height }}>
				<svg width={width} height={height}>
					<g id="LineSVG" />
				</svg>
			</div>
		</div>
	);
};

export default LineGraph;
