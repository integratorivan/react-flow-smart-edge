import { useNodes, BezierEdge } from '@xyflow/react'
import React from 'react'
import { SmartEdge } from '../SmartEdge'
import { svgDrawSmoothLinePath, pathfindingAStarDiagonal } from '../functions'
import type { SmartEdgeOptions } from '../SmartEdge'
import type { EdgeProps } from '@xyflow/react'

const BezierConfiguration: SmartEdgeOptions = {
	drawEdge: svgDrawSmoothLinePath,
	generatePath: pathfindingAStarDiagonal,
	fallback: BezierEdge
}

export function SmartBezierEdge(props: EdgeProps) {
	const nodes = useNodes()

	return <SmartEdge {...props} options={BezierConfiguration} nodes={nodes} />
}
