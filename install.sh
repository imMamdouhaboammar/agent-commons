#!/usr/bin/env bash
# ==============================================================================
# Agent Commons — Universal Multi-Agent Installer
# Installs and links the Agent Commons skill & CLI across all AI agent harnesses
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_NAME="agent-commons"

echo "================================================================"
echo "  🚀 Installing Agent Commons Multi-Agent Skill & Gateway"
echo "================================================================"

# 1. Claude Code & Desktop
if [ -d "$HOME/.claude" ] || command -v claude >/dev/null 2>&1; then
  mkdir -p "$HOME/.claude/skills"
  rm -rf "$HOME/.claude/skills/${TARGET_NAME}"
  cp -r "$SCRIPT_DIR" "$HOME/.claude/skills/${TARGET_NAME}"
  echo "  ✅ Installed for Claude Code -> $HOME/.claude/skills/${TARGET_NAME}"
fi

# 2. Google Antigravity & Gemini CLI
if [ -d "$HOME/.gemini" ]; then
  mkdir -p "$HOME/.gemini/config/skills"
  rm -rf "$HOME/.gemini/config/skills/${TARGET_NAME}"
  cp -r "$SCRIPT_DIR" "$HOME/.gemini/config/skills/${TARGET_NAME}"
  echo "  ✅ Installed for Antigravity & Gemini CLI -> $HOME/.gemini/config/skills/${TARGET_NAME}"
fi

# 3. OpenAI Codex & OpenCode
if [ -d "$HOME/.codex" ]; then
  mkdir -p "$HOME/.codex/skills"
  rm -rf "$HOME/.codex/skills/${TARGET_NAME}"
  cp -r "$SCRIPT_DIR" "$HOME/.codex/skills/${TARGET_NAME}"
  echo "  ✅ Installed for Codex & OpenCode -> $HOME/.codex/skills/${TARGET_NAME}"
fi

# 4. Universal Agent Kernel (~/.agents/skills)
mkdir -p "$HOME/.agents/skills"
rm -rf "$HOME/.agents/skills/${TARGET_NAME}"
cp -r "$SCRIPT_DIR" "$HOME/.agents/skills/${TARGET_NAME}"
echo "  ✅ Installed for Universal Agent Kernel -> $HOME/.agents/skills/${TARGET_NAME}"

# 5. Local CLI Symlink
if [ -d "$HOME/.local/bin" ]; then
  ln -sf "$SCRIPT_DIR/bin/cli.ts" "$HOME/.local/bin/agent-commons"
  echo "  ✅ Symlinked CLI to $HOME/.local/bin/agent-commons"
fi

echo ""
echo "🎉 Agent Commons installation complete across all active agent environments!"
echo "   Run 'agent-commons doctor' or start your agent harness to verify."
echo "================================================================"
