/* eslint-disable @typescript-eslint/no-unused-vars */
import { GraphBuilder } from '@teambit/graph';
import { Box, Text } from 'ink';
import React from 'react';

import NoDataForInsight from '../exceptions/no-data-for-insight';
import { Insight, InsightResult, RawResult } from '../insight';

export const INSIGHT_NAME = 'cyclic dependencies';

export default class FindCycles implements Insight {
  name = INSIGHT_NAME;
  description = 'Get all cyclic dependencies in component graph';
  graphBuilder: GraphBuilder;
  constructor(graphBuilder: GraphBuilder) {
    this.graphBuilder = graphBuilder;
  }
  async _runInsight(): Promise<RawResult> {
    const graph = await this.graphBuilder.getGraph();
    if (!graph) {
      return {
        message: '',
        data: undefined,
      };
    }
    const cycles = graph.findCycles();
    if (cycles.length === 1) {
      return {
        message: `Found ${cycles.length} cycle.`,
        data: cycles,
      };
    }
    return {
      message: `Found ${cycles.length} cycles.`,
      data: cycles,
    };
  }

  _renderData(data: any) {
    if (data.data.length === 0) {
      return (
        <div>
          <Text>No cyclic dependencies</Text>
        </div>
      );
    }
    return (
      <div>
        <div key="data">
          <div>{data.message}</div>
          <div>{data.data}</div>
        </div>
      </div>
    );
  }

  async run(): Promise<InsightResult> {
    const bareResult = await this._runInsight();
    const renderedData = this._renderData(bareResult);
    const result: InsightResult = {
      metaData: {
        name: this.name,
        description: this.description,
      },
      data: bareResult.data,
      renderedData,
    };

    if (bareResult.message) {
      result.message = bareResult.message;
    }
    return result;
  }
}
