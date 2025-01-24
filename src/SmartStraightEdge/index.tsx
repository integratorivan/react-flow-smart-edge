import { useNodes, StraightEdge } from '@xyflow/react'
import React from 'react'
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

export function SmartStraightEdge(props: EdgeProps) {
	const nodes = useNodes()

	return <SmartEdge {...props} options={StraightConfiguration} nodes={nodes} />
}
