import React from 'react'
import { useNodes, StraightEdge } from '@xyflow/react'
import { SmartEdge } from '../SmartEdge'
import {
	svgDrawStraightLinePath,
	pathfindingAStarNoDiagonal
} from '../functions'
import type { SmartEdgeOptions } from '../SmartEdge'
import type { EdgeProps } from '@xyflow/react'

const StraightConfiguration: SmartEdgeOptions = {
	drawEdge: svgDrawStraightLinePath,
	generatePath: pathfindingAStarNoDiagonal,
	fallback: StraightEdge
}

export function SmartStraightEdge<
	EdgeDataType = unknown,
	NodeDataType = unknown
>(props: EdgeProps<EdgeDataType>) {
	const nodes = useNodes<NodeDataType>()

	return (
		<SmartEdge<EdgeDataType, NodeDataType>
			{...props}
			options={StraightConfiguration}
			nodes={nodes}
		/>
	)
}
