import { useNodes, StraightEdge } from '@xyflow/react'
import React from 'react'
import { SmartEdge } from '../SmartEdge'
import {
	svgDrawStraightLinePath,
	pathfindingAStarNoDiagonal
} from '../functions'
import type { SmartEdgeOptions } from '../SmartEdge'
import type { EdgeProps, Node, Edge } from '@xyflow/react'

const StraightConfiguration: SmartEdgeOptions = {
	drawEdge: svgDrawStraightLinePath,
	generatePath: pathfindingAStarNoDiagonal,
	fallback: StraightEdge
}

export function SmartStraightEdge<
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
			options={StraightConfiguration}
			nodes={nodes as Node<NodeDataType>[]}
		/>
	)
}
