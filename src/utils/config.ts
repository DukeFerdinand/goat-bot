export interface ProjectConfig {
  clearableChannels: Array<string>
}

export const getConfig = (): ProjectConfig => {
  const config: ProjectConfig = {
    clearableChannels: [],
  }

  try {
    const clearableChannels = process.env.CLEARABLE_CHANNELS
      ? JSON.parse(process.env.CLEARABLE_CHANNELS)
      : []

    config.clearableChannels = clearableChannels
  } catch (e) {
    console.error('[ERROR at getConfig()]', e)
  }

  return config
}
