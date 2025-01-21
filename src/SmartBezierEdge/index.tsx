import { useNodes, BezierEdge } from '@xyflow/react'
import React from 'react'
import { SmartEdge } from '../SmartEdge'
import { pathfindingAStarDiagonal, svgDrawSmoothLinePath } from '../functions'
import type { SmartEdgeOptions } from '../SmartEdge'
import type { EdgeProps, Node, Edge } from '@xyflow/react'

const BezierConfiguration: SmartEdgeOptions = {
	drawEdge: svgDrawSmoothLinePath,
	generatePath: pathfindingAStarDiagonal,
	fallback: BezierEdge
}

export function SmartBezierEdge<
	EdgeDataType extends Edge<Record<string, unknown>, string | undefined> = Edge<
		Record<string, unknown>,
		string | undefined
	>,
	NodeDataType extends Node = Node
>(props: EdgeProps<EdgeDataType>) {
	const nodes = useNodes<NodeDataType>()

	return (
		<SmartEdge
			{...props}
			options={BezierConfiguration}
			nodes={nodes as Node<NodeDataType>[]}
		/>
	)
}
