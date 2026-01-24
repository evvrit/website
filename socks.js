    let measurements = {
      ankleCircumference: 25,
      cuffLength: 12,
      footLength: 28,
      footCircumference: 27
    };

    document.addEventListener('DOMContentLoaded', function() {
      loadAbbreviations();
      updatePattern();

      // Add input event listeners for real-time updates
      const inputs = [
        { id: 'ankle-circumference', key: 'ankleCircumference' },
        { id: 'cuff-length', key: 'cuffLength' },
        { id: 'foot-length', key: 'footLength' },
        { id: 'foot-circumference', key: 'footCircumference' }
      ];

      inputs.forEach(input => {
        const element = document.getElementById(input.id);
        const output = document.querySelector(`output[for="${input.id}"]`);

        element.addEventListener('input', function(event) {
          const value = parseFloat(event.target.value);
          measurements[input.key] = value;
          output.value = value;
          updatePattern();
        });
      });
    });

    function loadAbbreviations() {
      fetch('abbrevs.json')
        .then(response => response.json())
        .then(abbrevs => {
          addTooltipsToDocument(abbrevs);
        })
        .catch(error => console.error('Error loading abbreviations:', error));
    }

    function addTooltipsToDocument(abbrevs) {
      const body = document.body;
      const walker = document.createTreeWalker(
        body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: function(node) {
            if (node.parentElement.classList.contains('abbrev-wrapper') ||
                node.parentElement.classList.contains('abbrev-tooltip')) {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );

      const nodesToProcess = [];
      let currentNode;
      while (currentNode = walker.nextNode()) {
        nodesToProcess.push(currentNode);
      }

      const processedAbbrevs = new Set();

      nodesToProcess.forEach(node => {
        let text = node.textContent;
        let hasAbbrev = false;

        for (const [abbrev, fullForm] of Object.entries(abbrevs)) {
          if (text.includes(abbrev) && !processedAbbrevs.has(abbrev)) {
            hasAbbrev = true;
            break;
          }
        }

        if (hasAbbrev) {
          const fragment = document.createDocumentFragment();
          let lastIndex = 0;

          const pattern = new RegExp('\\b(' + Object.keys(abbrevs).join('|') + ')\\b', 'g');
          let match;
          const matches = [];

          while ((match = pattern.exec(text)) !== null) {
            if (!processedAbbrevs.has(match[0])) {
              matches.push({
                index: match.index,
                text: match[0],
                fullForm: abbrevs[match[0]]
              });
              processedAbbrevs.add(match[0]);
            }
          }

          if (matches.length > 0) {
            matches.forEach((match, i) => {
              if (match.index > lastIndex) {
                fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
              }

              const wrapper = document.createElement('span');
              wrapper.className = 'abbrev-wrapper';

              const abbrevText = document.createTextNode(match.text);
              wrapper.appendChild(abbrevText);

              const icon = document.createElement('span');
              icon.className = 'abbrev-icon';
              icon.textContent = 'i';
              wrapper.appendChild(icon);

              const tooltip = document.createElement('span');
              tooltip.className = 'abbrev-tooltip';
              tooltip.textContent = match.fullForm;
              wrapper.appendChild(tooltip);

              fragment.appendChild(wrapper);
              lastIndex = match.index + match.text.length;
            });

            if (lastIndex < text.length) {
              fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
            }

            node.parentNode.replaceChild(fragment, node);
          }
        }
      });
    }

    function updatePattern() {
      const diff = Math.abs(measurements.ankleCircumference - measurements.footCircumference);
      const biggerCircumference = Math.max(measurements.ankleCircumference, measurements.footCircumference)

      const sizeNote = document.getElementById('size-note');
      sizeNote.classList.add('hidden');

      const selectNdlSize = document.getElementById('select-ndl-size');
      const secondNdl = document.getElementById('switch-ndls');

      let inputNeedleSize;
      if (diff < 1) {
        inputNeedleSize = ['2.00mm'];
        secondNdl.classList.add('hidden');
      } else if (diff >= 1 && diff < 2) {
        inputNeedleSize = ['2.00mm', '2.25mm'];
      } else if (diff >= 2 && diff < 3) {
        inputNeedleSize = ['2.00mm', '2.50mm'];
      } else if (diff >= 3 && diff < 4) {
        inputNeedleSize = ['2.00mm', '2.75mm'];
      } else if (diff >= 4) {
        inputNeedleSize = ['2.00mm', '2.75mm'];
        sizeNote.classList.remove('hidden');
      }

      let selectFirstNdlSize;
      if (inputNeedleSize.length === 1) {
        selectFirstNdlSize = inputNeedleSize[0];
      } else {
        let selectSecondNdlSize;
        const needleSizes = inputNeedleSize.map(size => parseFloat(size.replace('mm', '')));
        if (measurements.ankleCircumference === biggerCircumference) {
          selectFirstNdlSize = Math.max(...needleSizes).toFixed(2) + 'mm';
          selectSecondNdlSize = Math.min(...needleSizes).toFixed(2) + 'mm';
        } else {
          selectFirstNdlSize = Math.min(...needleSizes).toFixed(2) + 'mm';
          selectSecondNdlSize = Math.max(...needleSizes).toFixed(2) + 'mm';
        }
        secondNdl.innerHTML = `Switch to <span class="select-second-ndl-size pattern-value">${selectSecondNdlSize}</span> needles.`;
        secondNdl.classList.remove('hidden');
      }

      selectNdlSize.textContent = `${inputNeedleSize.length === 1 ? "size" : "sizes"} ${inputNeedleSize.join(" and ")}`;

      let selectCastOnSts;

      if (measurements.ankleCircumference >= 13 && measurements.ankleCircumference <= 16) {
        selectCastOnSts = 44;
      } else if (measurements.ankleCircumference >= 17 && measurements.ankleCircumference <= 19.9) {
        selectCastOnSts = 52;
      } else if (measurements.ankleCircumference >= 20 && measurements.ankleCircumference <= 22.9) {
        selectCastOnSts = 64;
      } else if (measurements.ankleCircumference >= 23 && measurements.ankleCircumference <= 24.9) {
        selectCastOnSts = 68;
      } else if (measurements.ankleCircumference >= 25 && measurements.ankleCircumference <= 26.9) {
        selectCastOnSts = 76;
      } else if (measurements.ankleCircumference >= 27 && measurements.ankleCircumference <= 29.9) {
        selectCastOnSts = 84;
      } else if (measurements.ankleCircumference >= 30 && measurements.ankleCircumference <= 33.9) {
        selectCastOnSts = 92;
      }

      const displayCastOnSts = selectCastOnSts + 1;
      document.querySelectorAll('.select-cast-on-sts').forEach(el => {
        el.textContent = displayCastOnSts;
      });



      document.querySelectorAll('.select-first-ndl-size').forEach(el => {
        el.textContent = selectFirstNdlSize;
      });

      const selectCuffLength = measurements.cuffLength - 5;
      document.querySelectorAll('.select-cuff-length').forEach(el => {
        el.textContent = selectCuffLength + 'cm';
      });

      const selectHalfCastOnSts = selectCastOnSts / 2;
      const selectHalfCastOnStsMinus6 = selectHalfCastOnSts - 6;
      document.querySelectorAll('.select-half-cast-on-sts').forEach(el => {
        el.textContent = selectHalfCastOnSts;
      });
      document.querySelectorAll('.select-half-cast-on-sts-minus-6').forEach(el => {
        el.textContent = selectHalfCastOnStsMinus6;
      });

      const selectFootLength = measurements.footLength - 10;
      document.querySelectorAll('.select-foot-length').forEach(el => {
        el.textContent = selectFootLength + 'cm';
      });

      const selectWedgeFinishSts = selectCastOnSts < 56 ? 24 : 32;
      const selectWedgeFinishStsPlus12 = selectWedgeFinishSts + 12;
      document.querySelectorAll('.select-wedge-finish-sts').forEach(el => {
        el.textContent = selectWedgeFinishSts;
      });
      document.querySelectorAll('.select-wedge-finish-sts-plus-12').forEach(el => {
        el.textContent = selectWedgeFinishStsPlus12;
      });
    }
