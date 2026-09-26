"use client"

import { Component, type ReactNode } from "react"

interface Props { children: ReactNode }
interface State { errored: boolean }

export default class SectionErrorBoundary extends Component<Props, State> {
  state: State = { errored: false }

  static getDerivedStateFromError() {
    return { errored: true }
  }

  render() {
    if (this.state.errored) return null
    return this.props.children
  }
}
